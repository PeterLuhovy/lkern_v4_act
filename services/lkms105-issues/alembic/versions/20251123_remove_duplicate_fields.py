"""Remove duplicate browser, os, url fields

Revision ID: 20251123_1900
Revises: 20251121_add_system_info
Create Date: 2025-11-23 19:00:00.000000

Description:
    Removes duplicate columns (browser, os, url) from issues table.
    These fields are now stored only in system_info JSON column.
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20251123_1900'
down_revision = '20251121_system_info'
branch_labels = None
depends_on = None


def upgrade():
    """Remove duplicate columns from issues table."""
    # Drop columns in reverse order to avoid dependencies
    op.drop_column('issues', 'url')
    op.drop_column('issues', 'os')
    op.drop_column('issues', 'browser')


def downgrade():
    """Restore duplicate columns (for rollback)."""
    op.add_column('issues', sa.Column('browser', sa.String(length=100), nullable=True, comment='Browser name and version'))
    op.add_column('issues', sa.Column('os', sa.String(length=100), nullable=True, comment='Operating system'))
    op.add_column('issues', sa.Column('url', sa.String(length=500), nullable=True, comment='URL where issue occurred'))
