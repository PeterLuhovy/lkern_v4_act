"""Remove locked_by_name column - will use lookup instead

Revision ID: 6f4a8b9c0d1e
Revises: 5e3f7a8b9c0d
Create Date: 2025-12-09 11:15:00.000000+00:00

Description:
    Removes locked_by_name column from issues table.
    User name will be fetched via lookup instead of storing duplicate data.
    Only locked_by_id and locked_at are needed.
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6f4a8b9c0d1e'
down_revision = '5e3f7a8b9c0d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Remove locked_by_name column."""
    op.drop_column('issues', 'locked_by_name')


def downgrade() -> None:
    """Re-add locked_by_name column."""
    op.add_column(
        'issues',
        sa.Column(
            'locked_by_name',
            sa.String(200),
            nullable=True,
            comment='Name of user who holds the lock (for display)'
        )
    )
