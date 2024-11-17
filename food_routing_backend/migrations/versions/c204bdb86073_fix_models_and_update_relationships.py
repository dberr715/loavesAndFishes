"""Fix models and update relationships

Revision ID: c204bdb86073
Revises: 5aed31922726
Create Date: 2024-11-11 13:08:24.898126

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c204bdb86073'
down_revision: Union[str, None] = '5aed31922726'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
