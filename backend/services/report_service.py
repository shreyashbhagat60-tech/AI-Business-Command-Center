import io
import pandas as pd
from typing import Dict, Any, List
from services.analytics import analytics_engine

class ReportService:
    def get_report(self, report_type: str = "sales") -> List[Dict[str, Any]]:
        """Retrieve structured report records."""
        return analytics_engine.get_reports_data(report_type=report_type)

    def export_csv(self, report_type: str = "sales") -> str:
        """Export dataset as CSV text stream."""
        data = self.get_report(report_type)
        df = pd.DataFrame(data)
        stream = io.StringIO()
        df.to_csv(stream, index=False)
        return stream.getvalue()

    def export_excel(self, report_type: str = "sales") -> bytes:
        """Export dataset as binary Excel (.xlsx) stream."""
        data = self.get_report(report_type)
        df = pd.DataFrame(data)
        stream = io.BytesIO()
        with pd.ExcelWriter(stream, engine="openpyxl") as writer:
            df.to_excel(writer, index=False, sheet_name=report_type.capitalize())
        return stream.getvalue()

report_service = ReportService()
