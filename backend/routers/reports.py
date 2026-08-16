from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import Response
import pandas as pd
import io
import logging
from services.analytics import analytics_engine

logger = logging.getLogger("ai_command_center.routers.reports")
router = APIRouter(prefix="/reports", tags=["Reports & Exports"])

@router.get(
    "",
    summary="Get Structured Business Reports",
    description="Returns tabular report data for Sales, Profit, Churn, Segmentation, or Business Performance."
)
async def get_report(type: str = Query(default="sales", pattern="^(sales|profit|churn|segmentation|performance)$")):
    try:
        data = analytics_engine.get_reports_data(report_type=type)
        return {
            "report_type": type,
            "record_count": len(data),
            "data": data
        }
    except Exception as e:
        logger.error(f"Error fetching report {type}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve report data.")

@router.get(
    "/export",
    summary="Export Business Report as CSV / Excel / Spreadsheet",
    description="Generates real CSV or Excel spreadsheet stream for immediate browser download."
)
async def export_report(
    type: str = Query(default="sales", pattern="^(sales|profit|churn|segmentation|performance)$"),
    format: str = Query(default="csv", pattern="^(csv|xlsx|excel|json)$")
):
    try:
        data = analytics_engine.get_reports_data(report_type=type)
        df = pd.DataFrame(data)
        
        if format in ["xlsx", "excel"]:
            stream = io.BytesIO()
            with pd.ExcelWriter(stream, engine="openpyxl") as writer:
                df.to_excel(writer, index=False, sheet_name=type.capitalize())
            excel_bytes = stream.getvalue()
            return Response(
                content=excel_bytes,
                media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                headers={"Content-Disposition": f"attachment; filename=AI_Command_Center_{type}_report.xlsx"}
            )
        elif format == "csv":
            stream = io.StringIO()
            df.to_csv(stream, index=False)
            csv_content = stream.getvalue()
            
            return Response(
                content=csv_content,
                media_type="text/csv",
                headers={"Content-Disposition": f"attachment; filename=AI_Command_Center_{type}_report.csv"}
            )
        else:
            return {"report_type": type, "data": data}
            
    except Exception as e:
        logger.error(f"Error exporting report: {e}")
        raise HTTPException(status_code=500, detail="Failed to export report.")
