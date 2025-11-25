"""Add deletion_audit table for tracking deletion operations

Revision ID: 20251124_1500
Revises: 20251123_1900
Create Date: 2025-11-24 15:00:00.000000

Description:
    Creates deletion_audit table for tracking deletion operations with audit trail.

    Features:
    - Tracks deletion status (pending, completed, failed, partial)
    - Records files found/deleted/failed counts
    - Stores error messages for failed deletions
    - Supports Phase 2 async retry logic (retry_count, last_retry_at, celery_task_id)

    See: docs/programming/backend-standards.md - Deletion Audit Workflow
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '20251124_1500'
down_revision = '20251123_1900'
branch_labels = None
depends_on = None


def upgrade():
    """Create deletion_audit table."""
    # Drop existing enum type if it exists (handles both UPPERCASE and lowercase versions)
    op.execute("DROP TYPE IF EXISTS deletionstatus CASCADE")

    # Create fresh enum type with correct lowercase values
    op.execute("CREATE TYPE deletionstatus AS ENUM ('pending', 'completed', 'failed', 'partial')")

    # Create table with String column (to avoid SQLAlchemy enum event listener)
    op.create_table(
        'deletion_audit',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False, comment='Audit record ID'),

        # Item identification
        sa.Column('item_id', postgresql.UUID(as_uuid=True), nullable=False, comment='ID of deleted item'),
        sa.Column('item_code', sa.String(length=50), nullable=False, comment='Human-readable code (e.g. ISSUE-001)'),
        sa.Column('item_type', sa.String(length=50), nullable=False, comment='Type of item (issue, contact, order, etc.)'),

        # Deletion tracking (using String temporarily, will alter to enum below)
        sa.Column(
            'status',
            sa.String(20),
            nullable=False,
            server_default='pending',
            comment='Deletion status'
        ),

        # External resources tracking
        sa.Column('files_found', sa.Integer(), nullable=True, server_default='0', comment='Number of files found in MinIO'),
        sa.Column('files_deleted', sa.Integer(), nullable=True, server_default='0', comment='Number of files successfully deleted'),
        sa.Column('files_failed', postgresql.JSON(astext_type=sa.Text()), nullable=True, comment='List of files that failed to delete (array of objects)'),

        # Error details
        sa.Column('error_message', sa.String(length=1000), nullable=True, comment='Error message if deletion failed'),

        # Timestamps
        sa.Column('started_at', sa.DateTime(), nullable=False, server_default=sa.text('now()'), comment='Deletion start time'),
        sa.Column('completed_at', sa.DateTime(), nullable=True, comment='Deletion completion time'),

        # Metadata
        sa.Column('deleted_by', postgresql.UUID(as_uuid=True), nullable=True, comment='User who initiated deletion'),

        # Phase 2 enhancements (async background cleanup with retry logic)
        sa.Column('retry_count', sa.Integer(), nullable=True, server_default='0', comment='Number of retry attempts (Phase 2)'),
        sa.Column('last_retry_at', sa.DateTime(), nullable=True, comment='Last retry attempt timestamp (Phase 2)'),
        sa.Column('scheduled_at', sa.DateTime(), nullable=True, comment='When Celery task was scheduled (Phase 2)'),
        sa.Column('celery_task_id', sa.String(length=255), nullable=True, comment='Celery task UUID (Phase 2)'),

        sa.PrimaryKeyConstraint('id', name=op.f('pk_deletion_audit'))
    )

    # Create index on item_id for fast lookup
    op.create_index(op.f('ix_deletion_audit_item_id'), 'deletion_audit', ['item_id'], unique=False)

    # Alter status column to use enum type (3 steps to handle default value)
    op.execute("ALTER TABLE deletion_audit ALTER COLUMN status DROP DEFAULT")
    op.execute("ALTER TABLE deletion_audit ALTER COLUMN status TYPE deletionstatus USING status::deletionstatus")
    op.execute("ALTER TABLE deletion_audit ALTER COLUMN status SET DEFAULT 'pending'::deletionstatus")


def downgrade():
    """Drop deletion_audit table."""
    op.drop_index(op.f('ix_deletion_audit_item_id'), table_name='deletion_audit')
    op.drop_table('deletion_audit')
    op.execute('DROP TYPE deletionstatus')
