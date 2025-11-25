"""
================================================================
Add system_info column to issues table
================================================================
File: alembic/versions/20251121_add_system_info.py
Version: v1.0.0
Created: 2025-11-21

Description:
  Migration to add system_info JSON column for storing
  auto-generated browser context (browser, os, url, viewport, etc.)
================================================================
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSON

# revision identifiers, used by Alembic.
revision = '20251121_system_info'
down_revision = '20251121_prefixes'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add system_info column."""
    op.add_column(
        'issues',
        sa.Column(
            'system_info',
            JSON,
            nullable=True,
            comment='Auto-generated system info: {browser, os, url, viewport, screen, timestamp}'
        )
    )


def downgrade() -> None:
    """Remove system_info column."""
    op.drop_column('issues', 'system_info')
