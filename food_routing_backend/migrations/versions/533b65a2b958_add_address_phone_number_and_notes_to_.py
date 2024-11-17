"""Add address, phone_number, and notes to volunteers and drivers

Revision ID: 533b65a2b958
Revises: 
Create Date: 2024-11-11 12:33:53.558082

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '533b65a2b958'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
