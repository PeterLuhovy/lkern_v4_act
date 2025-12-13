"""Add locking columns to issues table

Revision ID: 5e3f7a8b9c0d
Revises: 4dc28d6267ec
Create Date: 2025-12-09 10:00:00.000000+00:00

Description:
    Adds pessimistic locking columns to issues table:
    - locked_by_id: UUID of user who holds the lock
    - locked_by_name: Name of user for display
    - locked_at: Timestamp when lock was acquired

    This enables pessimistic locking for edit modals to prevent
    concurrent editing conflicts.
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers, used by Alembic.
revision = '5e3f7a8b9c0d'
down_revision = '4dc28d6267ec'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add locking columns to issues table."""
    # locked_by_id - UUID of the user who holds the lock
    op.add_column(
        'issues',
        sa.Column(
            'locked_by_id',
            UUID(as_uuid=True),
            nullable=True,
            comment='UUID of user who holds the lock (null = unlocked)'
        )
    )

    # locked_by_name - User name for display in conflict message
    op.add_column(
        'issues',
        sa.Column(
            'locked_by_name',
            sa.String(200),
            nullable=True,
            comment='Name of user who holds the lock (for display)'
        )
    )

    # locked_at - Timestamp when lock was acquired
    op.add_column(
        'issues',
        sa.Column(
            'locked_at',
            sa.DateTime(),
            nullable=True,
            comment='Timestamp when lock was acquired'
        )
    )

    # Create index for faster lookups of locked issues
    op.create_index(
        op.f('ix_issues_locked_by_id'),
        'issues',
        ['locked_by_id'],
        unique=False
    )


def downgrade() -> None:
    """Remove locking columns from issues table."""
    op.drop_index(op.f('ix_issues_locked_by_id'), table_name='issues')
    op.drop_column('issues', 'locked_at')
    op.drop_column('issues', 'locked_by_name')
    op.drop_column('issues', 'locked_by_id')
