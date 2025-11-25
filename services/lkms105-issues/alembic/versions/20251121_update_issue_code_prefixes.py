"""
================================================================
Update issue_code prefixes to 3 letters
================================================================
File: alembic/versions/20251121_update_issue_code_prefixes.py
Version: v1.0.0
Created: 2025-11-21

Description:
  Migration to update existing issue codes from 4-letter prefixes
  (FEAT, IMPR, QUES) to 3-letter prefixes (FEA, IMP, QUE).
================================================================
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '20251121_prefixes'
down_revision = '6fc4d340b56e'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Update issue_code prefixes from 4 to 3 letters."""
    # FEAT -> FEA
    op.execute("""
        UPDATE issues
        SET issue_code = REPLACE(issue_code, 'FEAT-', 'FEA-')
        WHERE issue_code LIKE 'FEAT-%'
    """)

    # IMPR -> IMP
    op.execute("""
        UPDATE issues
        SET issue_code = REPLACE(issue_code, 'IMPR-', 'IMP-')
        WHERE issue_code LIKE 'IMPR-%'
    """)

    # QUES -> QUE
    op.execute("""
        UPDATE issues
        SET issue_code = REPLACE(issue_code, 'QUES-', 'QUE-')
        WHERE issue_code LIKE 'QUES-%'
    """)


def downgrade() -> None:
    """Revert issue_code prefixes from 3 to 4 letters."""
    # FEA -> FEAT
    op.execute("""
        UPDATE issues
        SET issue_code = REPLACE(issue_code, 'FEA-', 'FEAT-')
        WHERE issue_code LIKE 'FEA-%'
    """)

    # IMP -> IMPR
    op.execute("""
        UPDATE issues
        SET issue_code = REPLACE(issue_code, 'IMP-', 'IMPR-')
        WHERE issue_code LIKE 'IMP-%'
    """)

    # QUE -> QUES
    op.execute("""
        UPDATE issues
        SET issue_code = REPLACE(issue_code, 'QUE-', 'QUES-')
        WHERE issue_code LIKE 'QUE-%'
    """)
