import io
import datetime
from typing import Optional, List, Dict, Any

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    KeepTogether,
    HRFlowable,
)
from reportlab.pdfgen import canvas


class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and render total page count
    along with running header and footer.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count: int):
        self.saveState()
        page_width, page_height = letter

        # Running header (pages > 1)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#0F766E"))
            self.drawString(40, page_height - 30, "SmartHealth AI")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawString(105, page_height - 30, "• Confidential Clinical Patient Summary")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(40, page_height - 35, page_width - 40, page_height - 35)

        # Running footer (all pages)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.6)
        self.line(40, 38, page_width - 40, 38)

        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(
            40,
            24,
            "SmartHealth AI Clinical Systems • Automated Health Record & Risk Stratification",
        )
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(page_width - 40, 24, page_str)

        self.restoreState()


def calculate_risk_assessment(metrics: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes diagnostic risk score, clinical risk tier, and indicator factor breakdown.
    """
    score = 0
    factors_count = 0
    factors_list = []

    systolic = metrics.get("systolic_bp")
    diastolic = metrics.get("diastolic_bp")
    if systolic is not None:
        factors_count += 1
        if systolic >= 140:
            score += 30
            factors_list.append({
                "name": "Blood Pressure",
                "value": f"{systolic}/{diastolic or 80} mmHg",
                "status": "High (Stage 2 Hypertension)",
                "color": "#EF4444",
                "recommendation": "Elevated arterial pressure detected. Urgent physician consultation advised.",
            })
        elif systolic >= 130:
            score += 15
            factors_list.append({
                "name": "Blood Pressure",
                "value": f"{systolic}/{diastolic or 80} mmHg",
                "status": "Borderline / Prehypertension",
                "color": "#F59E0B",
                "recommendation": "Dietary sodium reduction, regular cardio exercise, and daily BP logging recommended.",
            })
        else:
            score += 5
            factors_list.append({
                "name": "Blood Pressure",
                "value": f"{systolic}/{diastolic or 80} mmHg",
                "status": "Normal / Optimal",
                "color": "#10B981",
                "recommendation": "Within optimal physiological parameters.",
            })

    glucose = metrics.get("blood_glucose")
    if glucose is not None:
        factors_count += 1
        if glucose >= 126:
            score += 30
            factors_list.append({
                "name": "Fasting Blood Glucose",
                "value": f"{glucose} mg/dL",
                "status": "Diabetic Range",
                "color": "#EF4444",
                "recommendation": "High glycaemic reading. HbA1c test and endocrinologist review indicated.",
            })
        elif glucose >= 100:
            score += 15
            factors_list.append({
                "name": "Fasting Blood Glucose",
                "value": f"{glucose} mg/dL",
                "status": "Pre-diabetic Range",
                "color": "#F59E0B",
                "recommendation": "Moderate glycaemic elevation. Implement low glycemic index dietary regimen.",
            })
        else:
            score += 3
            factors_list.append({
                "name": "Fasting Blood Glucose",
                "value": f"{glucose} mg/dL",
                "status": "Optimal Fasting",
                "color": "#10B981",
                "recommendation": "Within normal healthy glycemic range.",
            })

    heart_rate = metrics.get("heart_rate")
    if heart_rate is not None:
        factors_count += 1
        if heart_rate > 100 or heart_rate < 50:
            score += 20
            factors_list.append({
                "name": "Resting Heart Rate",
                "value": f"{heart_rate} bpm",
                "status": "Arrhythmia / Out of bounds",
                "color": "#EF4444",
                "recommendation": "Resting pulse abnormal. Cardiac rhythm assessment and ECG recommended.",
            })
        elif heart_rate > 90:
            score += 10
            factors_list.append({
                "name": "Resting Heart Rate",
                "value": f"{heart_rate} bpm",
                "status": "Elevated",
                "color": "#F59E0B",
                "recommendation": "Slightly elevated resting pulse. Monitor caffeine and stress levels.",
            })
        else:
            score += 2
            factors_list.append({
                "name": "Resting Heart Rate",
                "value": f"{heart_rate} bpm",
                "status": "Normal Resting Rate",
                "color": "#10B981",
                "recommendation": "Healthy baseline pulse.",
            })

    sleep = metrics.get("sleep_duration")
    if sleep is not None:
        factors_count += 1
        if sleep < 5:
            score += 20
            factors_list.append({
                "name": "Sleep Duration",
                "value": f"{sleep} hrs/night",
                "status": "Severe Sleep Deficit",
                "color": "#EF4444",
                "recommendation": "Significant chronic sleep deficit. Correlates with elevated cardiovascular stress.",
            })
        elif sleep < 7 or sleep > 9:
            score += 8
            factors_list.append({
                "name": "Sleep Duration",
                "value": f"{sleep} hrs/night",
                "status": "Sub-optimal Duration",
                "color": "#F59E0B",
                "recommendation": "Target 7 to 9 hours of uninterrupted restorative sleep per night.",
            })
        else:
            score += 1
            factors_list.append({
                "name": "Sleep Duration",
                "value": f"{sleep} hrs/night",
                "status": "Restorative / Ideal",
                "color": "#10B981",
                "recommendation": "Excellent sleep duration maintaining cognitive and immune health.",
            })

    if factors_count > 0:
        composite_score = min(round((score / factors_count) * 2.5), 100)
    else:
        composite_score = 15

    if composite_score < 25:
        tier = "Low Clinical Risk"
        tier_color = "#10B981"
        tier_bg = "#ECFDF5"
        tier_summary = "Patient presents strong biometric indicators within normal physiological baselines. Routine surveillance recommended."
    elif composite_score < 50:
        tier = "Moderate Risk (Watchlist)"
        tier_color = "#F59E0B"
        tier_bg = "#FFFBEB"
        tier_summary = "Mild lifestyle or metabolic variances identified. Regular monitoring and preventive lifestyle adjustments advised."
    elif composite_score < 75:
        tier = "High Clinical Risk"
        tier_color = "#F97316"
        tier_bg = "#FFF7ED"
        tier_summary = "Multiple biometric parameters exceed standard thresholds. Follow-up consultation with primary physician recommended."
    else:
        tier = "Critical Clinical Risk"
        tier_color = "#EF4444"
        tier_bg = "#FEF2F2"
        tier_summary = "Urgent clinical attention required. Severe deviations in vital metrics detected."

    return {
        "score": composite_score,
        "tier": tier,
        "tier_color": tier_color,
        "tier_bg": tier_bg,
        "tier_summary": tier_summary,
        "factors": factors_list,
    }


def generate_patient_medical_summary_pdf(
    patient: Dict[str, Any],
    metrics: Optional[Dict[str, Any]] = None,
    appointments: Optional[List[Dict[str, Any]]] = None,
    medicines: Optional[List[Dict[str, Any]]] = None,
) -> bytes:
    """
    Builds a downloadable, high-fidelity PDF medical summary and diagnostic report.
    Returns the binary content as bytes.
    """
    metrics = metrics or {
        "heart_rate": 72,
        "systolic_bp": 120,
        "diastolic_bp": 80,
        "blood_glucose": 95,
        "sleep_duration": 7.5,
        "weight": 70,
        "height": 175,
        "notes": "Standard baseline telemetry",
        "recorded_at": datetime.datetime.utcnow().isoformat(),
    }
    appointments = appointments or []
    medicines = medicines or []

    risk_data = calculate_risk_assessment(metrics)

    # Compute BMI if weight and height exist
    weight = metrics.get("weight")
    height = metrics.get("height")
    bmi_str = "N/A"
    bmi_status = "Not assessed"
    if weight and height and height > 0:
        try:
            bmi_val = round(float(weight) / ((float(height) / 100) ** 2), 1)
            if bmi_val < 18.5:
                bmi_status = "Underweight"
            elif bmi_val < 25.0:
                bmi_status = "Normal weight"
            elif bmi_val < 30.0:
                bmi_status = "Overweight"
            else:
                bmi_status = "Obese"
            bmi_str = f"{bmi_val} kg/m²"
        except Exception:
            pass

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=42,
        bottomMargin=45,
    )

    # Document Palette
    c_primary = colors.HexColor("#0F766E")    # Deep Teal
    c_dark = colors.HexColor("#0F172A")       # Slate 900
    c_gray = colors.HexColor("#475569")       # Slate 600
    c_light_bg = colors.HexColor("#F8FAFC")   # Slate 50
    c_border = colors.HexColor("#E2E8F0")     # Slate 200

    # Typography Styles
    base_styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "DocTitle",
        parent=base_styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        textColor=c_dark,
    )
    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=base_styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=c_gray,
    )
    section_heading = ParagraphStyle(
        "SectionHeading",
        parent=base_styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=14,
        textColor=c_primary,
        spaceBefore=10,
        spaceAfter=4,
    )
    body_style = ParagraphStyle(
        "BodyTextCustom",
        parent=base_styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11.5,
        textColor=c_dark,
    )
    body_muted = ParagraphStyle(
        "BodyMuted",
        parent=base_styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=10.5,
        textColor=c_gray,
    )
    cell_bold = ParagraphStyle(
        "CellBold",
        parent=base_styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=c_dark,
    )
    th_style = ParagraphStyle(
        "TableHeader",
        parent=base_styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
    )

    story = []

    # ─── HEADER BANNER ──────────────────────────────────────────────────────────
    now_utc = datetime.datetime.utcnow().strftime("%B %d, %Y at %H:%M UTC")
    report_ref = f"SH-MED-{patient.get('id', '00')}-{datetime.datetime.utcnow().strftime('%Y%m%d%H%M')}"

    header_left = [
        Paragraph("<b>SmartHealth AI</b> Medical Systems", title_style),
        Paragraph("Official Comprehensive Medical Summary & Clinical Risk Stratification", subtitle_style),
    ]

    header_right = [
        Paragraph(f"<b>Report Ref:</b> {report_ref}", body_muted),
        Paragraph(f"<b>Generated:</b> {now_utc}", body_muted),
        Paragraph("<b>Status:</b> <font color='#0D9488'><b>VERIFIED TELEMETRY</b></font>", body_muted),
    ]

    header_table = Table(
        [[header_left, header_right]],
        colWidths=[330, 202],
    )
    header_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (1, 0), (1, -1), "RIGHT"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=2, color=c_primary, spaceBefore=2, spaceAfter=8))

    # ─── SECTION 1: PATIENT IDENTITY ───────────────────────────────────────────
    story.append(Paragraph("1. Patient Profile & Administrative Details", section_heading))

    patient_name = patient.get("full_name") or patient.get("name") or "Anonymous Patient"
    patient_email = patient.get("email") or "Not provided"
    patient_role = str(patient.get("role", "Patient")).capitalize()
    patient_id_val = f"PID-{patient.get('id', 'N/A'):04d}" if isinstance(patient.get('id'), int) else str(patient.get('id', 'N/A'))

    info_data = [
        [
            Paragraph("<b>Patient Name:</b>", body_muted),
            Paragraph(patient_name, cell_bold),
            Paragraph("<b>Patient ID:</b>", body_muted),
            Paragraph(patient_id_val, cell_bold),
        ],
        [
            Paragraph("<b>Email Contact:</b>", body_muted),
            Paragraph(patient_email, body_style),
            Paragraph("<b>Account Role:</b>", body_muted),
            Paragraph(patient_role, body_style),
        ],
        [
            Paragraph("<b>Account Status:</b>", body_muted),
            Paragraph("<font color='#10B981'><b>Active / In Good Standing</b></font>", body_style),
            Paragraph("<b>Primary Facility:</b>", body_muted),
            Paragraph("SmartHealth Care Network", body_style),
        ],
    ]

    info_table = Table(info_data, colWidths=[95, 170, 95, 172])
    info_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_light_bg),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, c_border),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 8))

    # ─── SECTION 2: BIOMETRICS & VITALS ────────────────────────────────────────
    story.append(Paragraph("2. Physiological Biometrics & Recent Vitals", section_heading))

    hr_val = f"{metrics.get('heart_rate')} bpm" if metrics.get("heart_rate") else "—"
    bp_sys = metrics.get("systolic_bp")
    bp_dia = metrics.get("diastolic_bp")
    bp_val = f"{bp_sys}/{bp_dia} mmHg" if bp_sys and bp_dia else "—"
    glu_val = f"{metrics.get('blood_glucose')} mg/dL" if metrics.get("blood_glucose") else "—"
    sleep_val = f"{metrics.get('sleep_duration')} hours" if metrics.get("sleep_duration") else "—"
    weight_val = f"{metrics.get('weight')} kg" if metrics.get("weight") else "—"
    height_val = f"{metrics.get('height')} cm" if metrics.get("height") else "—"

    # Status helpers
    def get_bp_status(s, d):
        if not s or not d: return ("Unrecorded", "#64748B")
        if s < 120 and d < 80: return ("Optimal Normal", "#10B981")
        if s < 130 and d < 80: return ("Elevated", "#F59E0B")
        if s < 140 or d < 90: return ("Stage 1 Hypertension", "#F97316")
        return ("Stage 2 Hypertension", "#EF4444")

    def get_glucose_status(g):
        if not g: return ("Unrecorded", "#64748B")
        if g < 100: return ("Optimal Fasting", "#10B981")
        if g < 126: return ("Pre-diabetic", "#F59E0B")
        return ("Diabetic Level", "#EF4444")

    def get_hr_status(h):
        if not h: return ("Unrecorded", "#64748B")
        if 60 <= h <= 100: return ("Normal Resting", "#10B981")
        if h > 100: return ("Tachycardia", "#EF4444")
        return ("Bradycardia", "#EF4444")

    bp_status_label, bp_status_color = get_bp_status(bp_sys, bp_dia)
    glu_status_label, glu_status_color = get_glucose_status(metrics.get("blood_glucose"))
    hr_status_label, hr_status_color = get_hr_status(metrics.get("heart_rate"))

    vitals_data = [
        [
            Paragraph("Biometric Parameter", th_style),
            Paragraph("Patient Reading", th_style),
            Paragraph("Standard Target Range", th_style),
            Paragraph("Clinical Evaluation", th_style),
        ],
        [
            Paragraph("<b>Resting Heart Rate</b>", body_style),
            Paragraph(hr_val, cell_bold),
            Paragraph("60 – 100 bpm", body_muted),
            Paragraph(f"<font color='{hr_status_color}'><b>{hr_status_label}</b></font>", body_style),
        ],
        [
            Paragraph("<b>Blood Pressure (Systolic/Diastolic)</b>", body_style),
            Paragraph(bp_val, cell_bold),
            Paragraph("&lt; 120 / &lt; 80 mmHg", body_muted),
            Paragraph(f"<font color='{bp_status_color}'><b>{bp_status_label}</b></font>", body_style),
        ],
        [
            Paragraph("<b>Fasting Blood Glucose</b>", body_style),
            Paragraph(glu_val, cell_bold),
            Paragraph("70 – 99 mg/dL", body_muted),
            Paragraph(f"<font color='{glu_status_color}'><b>{glu_status_label}</b></font>", body_style),
        ],
        [
            Paragraph("<b>Sleep Duration</b>", body_style),
            Paragraph(sleep_val, cell_bold),
            Paragraph("7.0 – 9.0 hrs/night", body_muted),
            Paragraph(
                "<font color='#10B981'><b>Adequate</b></font>" if metrics.get("sleep_duration", 0) and metrics.get("sleep_duration", 0) >= 7 else "<font color='#F59E0B'><b>Sleep Deficit</b></font>",
                body_style,
            ),
        ],
        [
            Paragraph("<b>Body Mass Index (BMI)</b>", body_style),
            Paragraph(bmi_str, cell_bold),
            Paragraph("18.5 – 24.9 kg/m²", body_muted),
            Paragraph(f"<b>{bmi_status}</b> (Wt: {weight_val}, Ht: {height_val})", body_muted),
        ],
    ]

    vitals_table = Table(vitals_data, colWidths=[165, 100, 115, 152])
    vitals_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), c_primary),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, c_light_bg]),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, c_border),
        ("TOPPADDING", (0, 0), (-1, -1), 3.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(vitals_table)
    story.append(Spacer(1, 8))

    # ─── SECTION 3: AI HEALTH RISK ASSESSMENT ──────────────────────────────────
    story.append(Paragraph("3. AI Diagnostic Risk Stratification & Key Findings", section_heading))

    tier_badge_html = f"<font color='{risk_data['tier_color']}'><b>{risk_data['tier']} ({risk_data['score']}/100)</b></font>"
    score_desc = f"""
    <b>Stratified Risk Status:</b> {tier_badge_html}<br/>
    <b>AI Synthesis:</b> {risk_data['tier_summary']}
    """

    risk_box_data = [[
        Paragraph(score_desc, body_style),
    ]]
    risk_box = Table(risk_box_data, colWidths=[532])
    risk_box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(risk_data["tier_bg"])),
        ("BOX", (0, 0), (-1, -1), 1, colors.HexColor(risk_data["tier_color"])),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(risk_box)
    story.append(Spacer(1, 4))

    # Factor bullet items
    if risk_data["factors"]:
        factors_table_data = [
            [
                Paragraph("Indicator", th_style),
                Paragraph("Status Level", th_style),
                Paragraph("Clinical Action / Lifestyle Guidance", th_style),
            ]
        ]
        for f in risk_data["factors"]:
            factors_table_data.append([
                Paragraph(f"<b>{f['name']}</b> ({f['value']})", body_style),
                Paragraph(f"<font color='{f['color']}'><b>{f['status']}</b></font>", body_style),
                Paragraph(f['recommendation'], body_muted),
            ])

        factors_table = Table(factors_table_data, colWidths=[150, 130, 252])
        factors_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#334155")),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, c_light_bg]),
            ("BOX", (0, 0), (-1, -1), 0.5, c_border),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, c_border),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ("LEFTPADDING", (0, 0), (-1, -1), 5),
            ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ]))
        story.append(factors_table)

    story.append(Spacer(1, 8))

    # ─── SECTION 4: MEDICATIONS & REGIMEN ──────────────────────────────────────
    story.append(Paragraph("4. Prescribed Medications & Therapeutic Regimen", section_heading))

    if medicines and len(medicines) > 0:
        meds_data = [
            [
                Paragraph("Medication Name", th_style),
                Paragraph("Dosage", th_style),
                Paragraph("Frequency / Timing", th_style),
                Paragraph("Clinical Instructions", th_style),
                Paragraph("Adherence", th_style),
            ]
        ]
        for m in medicines:
            med_name = m.get("name", "Unknown Medicine")
            dosage = m.get("dosage") or "As prescribed"
            freq = m.get("frequency") or "Daily"
            instr = m.get("instructions") or "Follow standard packaging directions"
            is_taken = m.get("is_taken", False)
            adh_label = "<font color='#10B981'><b>✓ Taken Today</b></font>" if is_taken else "<font color='#F59E0B'>Pending</font>"

            meds_data.append([
                Paragraph(f"<b>{med_name}</b>", body_style),
                Paragraph(dosage, body_muted),
                Paragraph(freq, body_muted),
                Paragraph(instr, body_muted),
                Paragraph(adh_label, body_style),
            ])

        meds_table = Table(meds_data, colWidths=[130, 75, 95, 142, 90])
        meds_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), c_primary),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, c_light_bg]),
            ("BOX", (0, 0), (-1, -1), 0.5, c_border),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, c_border),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ("LEFTPADDING", (0, 0), (-1, -1), 5),
            ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ]))
        story.append(meds_table)
    else:
        empty_meds = [[
            Paragraph("<i>No active prescription medications registered in patient file.</i>", body_muted)
        ]]
        story.append(Table(empty_meds, colWidths=[532], style=[
            ("BACKGROUND", (0, 0), (-1, -1), c_light_bg),
            ("BOX", (0, 0), (-1, -1), 0.5, c_border),
            ("PADDING", (0, 0), (-1, -1), 5),
        ]))

    story.append(Spacer(1, 8))

    # ─── SECTION 5: DOCTOR APPOINTMENTS ───────────────────────────────────────
    story.append(Paragraph("5. Recent & Scheduled Medical Consultations", section_heading))

    if appointments and len(appointments) > 0:
        appts_data = [
            [
                Paragraph("Consultation Date", th_style),
                Paragraph("Healthcare Professional", th_style),
                Paragraph("Clinical Purpose / Reason", th_style),
                Paragraph("Status", th_style),
            ]
        ]
        for a in appointments[:5]:
            raw_date = a.get("appointment_date")
            date_str = "Scheduled"
            if raw_date:
                try:
                    if isinstance(raw_date, str):
                        dt = datetime.datetime.fromisoformat(raw_date.replace("Z", "+00:00"))
                    else:
                        dt = raw_date
                    date_str = dt.strftime("%b %d, %Y - %I:%M %p")
                except Exception:
                    date_str = str(raw_date)[:16]

            doctor_name = a.get("doctor_name") or f"Specialist (Dr #{a.get('doctor_id', '—')})"
            reason = a.get("reason") or "Routine health examination"
            status = (a.get("status") or "Pending").capitalize()

            status_color = "#10B981" if status.lower() == "confirmed" else ("#EF4444" if status.lower() == "cancelled" else "#F59E0B")

            appts_data.append([
                Paragraph(date_str, body_muted),
                Paragraph(f"<b>{doctor_name}</b>", body_style),
                Paragraph(reason, body_muted),
                Paragraph(f"<font color='{status_color}'><b>{status}</b></font>", body_style),
            ])

        appts_table = Table(appts_data, colWidths=[120, 140, 182, 90])
        appts_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#334155")),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, c_light_bg]),
            ("BOX", (0, 0), (-1, -1), 0.5, c_border),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, c_border),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ("LEFTPADDING", (0, 0), (-1, -1), 5),
            ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ]))
        story.append(appts_table)
    else:
        empty_appts = [[
            Paragraph("<i>No past or scheduled consultations logged.</i>", body_muted)
        ]]
        story.append(Table(empty_appts, colWidths=[532], style=[
            ("BACKGROUND", (0, 0), (-1, -1), c_light_bg),
            ("BOX", (0, 0), (-1, -1), 0.5, c_border),
            ("PADDING", (0, 0), (-1, -1), 5),
        ]))

    story.append(Spacer(1, 10))

    # ─── SECTION 6: LEGAL DISCLAIMER & GOVERNANCE ─────────────────────────────
    disclaimer_text = (
        "<b>CLINICAL GOVERNANCE & CONFIDENTIALITY NOTICE:</b> This electronic health summary is generated automatically by "
        "SmartHealth AI Clinical Systems for authorized patient reference and clinical continuity. It incorporates diagnostic "
        "heuristics and machine learning telemetry to support healthcare decision-making, but does NOT constitute an independent "
        "clinical diagnosis. In case of acute medical emergencies, immediately contact local emergency medical services or visit "
        "the nearest trauma care facility."
    )
    disclaimer_table = Table([[Paragraph(disclaimer_text, body_muted)]], colWidths=[532])
    disclaimer_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F1F5F9")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
    ]))
    story.append(KeepTogether([disclaimer_table]))

    # Build PDF with NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
