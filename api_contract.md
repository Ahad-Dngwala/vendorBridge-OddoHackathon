# 📦 Procurement Management System — Full API Contract

> **Base URL:** `https://<your-domain>/api/v1`  
> **Auth:** Bearer JWT in `Authorization` header (except public routes)  
> **Roles:** `admin` | `procurement_officer` | `manager` | `vendor`

---

## 🔐 Legend

| Icon | Meaning |
|------|---------|
| 🌐 | Public (no auth required) |
| 👑 | Admin only |
| 🛒 | Procurement Officer |
| ✅ | Manager / Approver |
| 🏪 | Vendor |
| 🔄 | Multiple roles (listed inline) |

---

## 1. AUTH & ORGANIZATION

### 1.1 Register Organization (Admin Self-Registration)

```
POST /auth/register-org                     🌐 Public
```

**Request Body:**
```json
{
  "org_name": "Acme Corp",
  "org_address": "123 Main St",
  "org_gst": "29ABCDE1234F1Z5",
  "org_industry": "Manufacturing",
  "org_website": "https://acme.com",
  "admin_name": "John Doe",
  "admin_email": "john@acme.com",
  "admin_password": "StrongPass@123"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Organization registered successfully",
  "org_id": "uuid",
  "admin_id": "uuid"
}
```

---

### 1.2 Login (All Roles)

```
POST /auth/login                            🌐 Public
```

**Request Body:**
```json
{
  "email": "john@acme.com",
  "password": "StrongPass@123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "refresh_token": "refresh_token_here",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@acme.com",
    "role": "admin",
    "org_id": "uuid",
    "avatar_url": null
  }
}
```

---

### 1.3 Refresh Token

```
POST /auth/refresh-token                    🌐 Public
```

**Request Body:**
```json
{ "refresh_token": "token_here" }
```

**Response `200`:**
```json
{ "token": "new_jwt_token" }
```

---

### 1.4 Logout

```
POST /auth/logout                           🔄 All roles
```

**Response `200`:**
```json
{ "success": true, "message": "Logged out successfully" }
```

---

### 1.5 Forgot Password

```
POST /auth/forgot-password                  🌐 Public
```

**Request Body:**
```json
{ "email": "john@acme.com" }
```

**Response `200`:**
```json
{ "success": true, "message": "Password reset link sent to email" }
```

---

### 1.6 Reset Password

```
POST /auth/reset-password                   🌐 Public
```

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "new_password": "NewPass@456"
}
```

**Response `200`:**
```json
{ "success": true, "message": "Password reset successfully" }
```

---

### 1.7 Change Password (Authenticated)

```
PUT /auth/change-password                   🔄 All roles
```

**Request Body:**
```json
{
  "current_password": "OldPass@123",
  "new_password": "NewPass@456"
}
```

**Response `200`:**
```json
{ "success": true, "message": "Password changed successfully" }
```

---

### 1.8 Get My Profile

```
GET /auth/me                                🔄 All roles
```

**Response `200`:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@acme.com",
  "role": "admin",
  "org_id": "uuid",
  "org_name": "Acme Corp",
  "phone": "+91-9876543210",
  "avatar_url": null,
  "is_active": true,
  "created_at": "2026-01-01T00:00:00Z"
}
```

---

### 1.9 Update My Profile

```
PUT /auth/me                                🔄 All roles
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+91-9876543210",
  "avatar_url": "https://cdn/avatar.png"
}
```

---

## 2. ORGANIZATION MANAGEMENT

### 2.1 Get Organization Details

```
GET /org/me                                 👑 Admin
```

**Response `200`:**
```json
{
  "id": "uuid",
  "name": "Acme Corp",
  "address": "123 Main St",
  "gst": "29ABCDE1234F1Z5",
  "industry": "Manufacturing",
  "website": "https://acme.com",
  "logo_url": null,
  "created_at": "2026-01-01T00:00:00Z"
}
```

---

### 2.2 Update Organization Details

```
PUT /org/me                                 👑 Admin
```

**Request Body:**
```json
{
  "name": "Acme Corp Updated",
  "address": "456 New St",
  "gst": "29ABCDE1234F1Z5",
  "website": "https://acme-new.com",
  "logo_url": "https://cdn/logo.png"
}
```

---

## 3. USER MANAGEMENT (Admin)

### 3.1 Invite / Create User

```
POST /admin/users/invite                    👑 Admin
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@acme.com",
  "role": "procurement_officer",
  "phone": "+91-9000000001",
  "department": "Procurement",
  "generated_password": "TempPass@789"
}
```
> `role` can be: `procurement_officer` | `manager` | `vendor_contact` (internal invite; vendor external via /vendors)

**Response `201`:**
```json
{
  "success": true,
  "message": "User invited. Credentials sent to email.",
  "user_id": "uuid"
}
```

---

### 3.2 List All Users

```
GET /admin/users                            👑 Admin
```

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `role` | string | Filter by role |
| `is_active` | boolean | Filter by status |
| `search` | string | Name/email search |
| `page` | number | Pagination |
| `limit` | number | Items per page |

**Response `200`:**
```json
{
  "users": [
    {
      "id": "uuid",
      "name": "Jane Smith",
      "email": "jane@acme.com",
      "role": "procurement_officer",
      "is_active": true,
      "created_at": "2026-01-01T00:00:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 10
}
```

---

### 3.3 Get Single User

```
GET /admin/users/:userId                    👑 Admin
```

---

### 3.4 Update User

```
PUT /admin/users/:userId                    👑 Admin
```

**Request Body:**
```json
{
  "name": "Jane Updated",
  "phone": "+91-9000000002",
  "department": "Finance",
  "role": "manager",
  "is_active": true
}
```

---

### 3.5 Deactivate / Activate User

```
PATCH /admin/users/:userId/status           👑 Admin
```

**Request Body:**
```json
{ "is_active": false }
```

---

### 3.6 Reset User Password (Admin forced reset)

```
POST /admin/users/:userId/reset-password    👑 Admin
```

**Request Body:**
```json
{ "new_password": "ResetPass@999" }
```

---

### 3.7 Delete User

```
DELETE /admin/users/:userId                 👑 Admin
```

---

## 4. VENDOR MANAGEMENT

### 4.1 Create / Invite Vendor

```
POST /admin/vendors                         👑 Admin
```

**Request Body:**
```json
{
  "company_name": "Steel Suppliers Ltd",
  "contact_person": "Raj Kumar",
  "email": "raj@steelsuppliers.com",
  "phone": "+91-9111111111",
  "address": "Plot 12, MIDC, Pune",
  "gst_number": "27AAAPL1234C1Z5",
  "pan_number": "AAAPL1234C",
  "category": ["Raw Materials", "Steel"],
  "bank_name": "HDFC Bank",
  "bank_account": "12345678901234",
  "bank_ifsc": "HDFC0001234",
  "generated_password": "Vendor@123",
  "notes": "Preferred vendor for Q1"
}
```

**Response `201`:**
```json
{
  "success": true,
  "vendor_id": "uuid",
  "message": "Vendor created. Login credentials sent to vendor email."
}
```

---

### 4.2 List All Vendors

```
GET /admin/vendors                          👑 Admin | 🛒 Procurement Officer
```

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category |
| `is_active` | boolean | Active/inactive filter |
| `is_approved` | boolean | Approval status filter |
| `search` | string | Name/email/GST search |
| `page` | number | Pagination |
| `limit` | number | Items per page |

---

### 4.3 Get Single Vendor

```
GET /admin/vendors/:vendorId                👑 Admin | 🛒 Procurement Officer
```

**Response `200`:**
```json
{
  "id": "uuid",
  "company_name": "Steel Suppliers Ltd",
  "contact_person": "Raj Kumar",
  "email": "raj@steelsuppliers.com",
  "phone": "+91-9111111111",
  "address": "Plot 12, MIDC, Pune",
  "gst_number": "27AAAPL1234C1Z5",
  "pan_number": "AAAPL1234C",
  "category": ["Raw Materials", "Steel"],
  "is_active": true,
  "is_approved": true,
  "rating": 4.5,
  "total_orders": 12,
  "on_time_delivery_rate": 91.6,
  "created_at": "2026-01-01T00:00:00Z"
}
```

---

### 4.4 Update Vendor

```
PUT /admin/vendors/:vendorId                👑 Admin
```

---

### 4.5 Approve / Reject Vendor

```
PATCH /admin/vendors/:vendorId/status       👑 Admin
```

**Request Body:**
```json
{
  "is_approved": true,
  "is_active": true,
  "remarks": "Verified documents"
}
```

---

### 4.6 Delete Vendor

```
DELETE /admin/vendors/:vendorId             👑 Admin
```

---

### 4.7 Vendor: Get Own Profile

```
GET /vendor/profile                         🏪 Vendor
```

---

### 4.8 Vendor: Update Own Profile

```
PUT /vendor/profile                         🏪 Vendor
```

**Request Body:**
```json
{
  "contact_person": "Raj Kumar Jr.",
  "phone": "+91-9222222222",
  "address": "New Address",
  "bank_account": "98765432109876",
  "bank_ifsc": "HDFC0009876"
}
```

---

## 5. RFQ (Request for Quotation)

### 5.1 Create RFQ

```
POST /rfq                                   🛒 Procurement Officer
```

**Request Body:**
```json
{
  "title": "Steel Rods Q2 2026",
  "description": "Need 500 units of 10mm steel rods",
  "items": [
    {
      "product_name": "Steel Rod 10mm",
      "description": "Grade A, Hot Rolled",
      "quantity": 500,
      "unit": "pieces",
      "specifications": "IS:1786 Grade Fe 415"
    }
  ],
  "deadline": "2026-07-01T18:00:00Z",
  "delivery_location": "Pune Factory",
  "vendor_ids": ["uuid1", "uuid2", "uuid3"],
  "attachment_urls": ["https://cdn/spec.pdf"],
  "notes": "Urgent requirement"
}
```

**Response `201`:**
```json
{
  "success": true,
  "rfq_id": "uuid",
  "rfq_number": "RFQ-2026-0001",
  "status": "sent",
  "message": "RFQ sent to 3 approved vendors"
}
```

---

### 5.2 List All RFQs

```
GET /rfq                                    🛒 Procurement Officer | 👑 Admin | ✅ Manager
```

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | `draft`,`sent`,`closed`,`awarded`,`cancelled` |
| `search` | string | Title/RFQ number search |
| `date_from` | date | Created from date |
| `date_to` | date | Created to date |
| `page` | number | Pagination |
| `limit` | number | Items per page |

**Response `200`:**
```json
{
  "rfqs": [
    {
      "id": "uuid",
      "rfq_number": "RFQ-2026-0001",
      "title": "Steel Rods Q2 2026",
      "status": "sent",
      "deadline": "2026-07-01T18:00:00Z",
      "vendor_count": 3,
      "quotation_count": 2,
      "created_by": "Jane Smith",
      "created_at": "2026-06-01T00:00:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 10
}
```

---

### 5.3 Get Single RFQ

```
GET /rfq/:rfqId                             🛒 Procurement Officer | 👑 Admin | ✅ Manager
```

---

### 5.4 Update RFQ (only if draft)

```
PUT /rfq/:rfqId                             🛒 Procurement Officer
```

---

### 5.5 Cancel RFQ

```
PATCH /rfq/:rfqId/cancel                    🛒 Procurement Officer
```

**Request Body:**
```json
{ "reason": "Budget constraint" }
```

---

### 5.6 Add Vendors to Existing RFQ

```
POST /rfq/:rfqId/vendors                    🛒 Procurement Officer
```

**Request Body:**
```json
{ "vendor_ids": ["uuid4", "uuid5"] }
```

---

### 5.7 Vendor: List RFQs Sent to Me

```
GET /vendor/rfqs                            🏪 Vendor
```

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | `pending`,`quoted`,`closed`,`awarded` |
| `page` | number | Pagination |
| `limit` | number | Items per page |

---

### 5.8 Vendor: Get Single RFQ Detail

```
GET /vendor/rfqs/:rfqId                     🏪 Vendor
```

---

## 6. QUOTATIONS

### 6.1 Vendor: Submit Quotation

```
POST /vendor/rfqs/:rfqId/quotation          🏪 Vendor
```

**Request Body:**
```json
{
  "items": [
    {
      "rfq_item_id": "uuid",
      "product_name": "Steel Rod 10mm",
      "unit_price": 85.50,
      "quantity": 500,
      "unit": "pieces",
      "tax_percent": 18,
      "subtotal": 42750
    }
  ],
  "total_amount": 50445,
  "currency": "INR",
  "delivery_timeline_days": 14,
  "delivery_terms": "Ex-Works Pune",
  "payment_terms": "Net 30",
  "validity_days": 30,
  "notes": "Prices valid for 30 days",
  "attachment_urls": ["https://cdn/quotation.pdf"]
}
```

**Response `201`:**
```json
{
  "success": true,
  "quotation_id": "uuid",
  "quotation_number": "QT-2026-0001",
  "pdf_url": "https://cdn/generated/QT-2026-0001.pdf",
  "message": "Quotation submitted and PDF generated"
}
```

---

### 6.2 Vendor: Update/Edit Quotation (before PO is raised)

```
PUT /vendor/rfqs/:rfqId/quotation/:quotationId    🏪 Vendor
```

---

### 6.3 Vendor: Get My Quotations

```
GET /vendor/quotations                      🏪 Vendor
```

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | `submitted`,`under_review`,`shortlisted`,`rejected`,`accepted` |
| `page` | number | Pagination |

---

### 6.4 Vendor: Get Single Quotation

```
GET /vendor/quotations/:quotationId         🏪 Vendor
```

---

### 6.5 Procurement Officer: List Quotations for an RFQ

```
GET /rfq/:rfqId/quotations                  🛒 Procurement Officer | ✅ Manager
```

**Response `200`:**
```json
{
  "rfq_id": "uuid",
  "rfq_number": "RFQ-2026-0001",
  "quotations": [
    {
      "quotation_id": "uuid",
      "quotation_number": "QT-2026-0001",
      "vendor_id": "uuid",
      "vendor_name": "Steel Suppliers Ltd",
      "vendor_rating": 4.5,
      "total_amount": 50445,
      "delivery_timeline_days": 14,
      "submitted_at": "2026-06-10T12:00:00Z",
      "status": "submitted",
      "pdf_url": "https://cdn/generated/QT-2026-0001.pdf"
    }
  ]
}
```

---

### 6.6 Procurement Officer: Compare Quotations (Side-by-Side)

```
GET /rfq/:rfqId/quotations/compare          🛒 Procurement Officer | ✅ Manager
```

**Response `200`:**
```json
{
  "rfq_id": "uuid",
  "rfq_number": "RFQ-2026-0001",
  "items_comparison": [
    {
      "product_name": "Steel Rod 10mm",
      "quantity": 500,
      "unit": "pieces",
      "vendors": [
        {
          "vendor_id": "uuid1",
          "vendor_name": "Steel Suppliers Ltd",
          "unit_price": 85.50,
          "subtotal": 42750,
          "tax": 7695,
          "total": 50445,
          "delivery_days": 14,
          "is_lowest_price": true
        },
        {
          "vendor_id": "uuid2",
          "vendor_name": "Iron Works Co",
          "unit_price": 92.00,
          "subtotal": 46000,
          "tax": 8280,
          "total": 54280,
          "delivery_days": 10,
          "is_lowest_price": false
        }
      ]
    }
  ],
  "summary": {
    "lowest_price_vendor_id": "uuid1",
    "fastest_delivery_vendor_id": "uuid2"
  }
}
```

---

### 6.7 Procurement Officer: Select / Shortlist Vendor Quotation

```
PATCH /rfq/:rfqId/quotations/:quotationId/select   🛒 Procurement Officer
```

**Request Body:**
```json
{
  "selection_reason": "Best price with acceptable delivery timeline"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Quotation shortlisted. Approval request sent to manager.",
  "approval_request_id": "uuid"
}
```

---

## 7. APPROVAL WORKFLOW

### 7.1 Manager: List Pending Approvals

```
GET /approvals                              ✅ Manager
```

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | `pending`,`approved`,`rejected` |
| `page` | number | Pagination |
| `limit` | number | Items per page |

**Response `200`:**
```json
{
  "approvals": [
    {
      "approval_id": "uuid",
      "rfq_id": "uuid",
      "rfq_number": "RFQ-2026-0001",
      "rfq_title": "Steel Rods Q2 2026",
      "selected_vendor": "Steel Suppliers Ltd",
      "quotation_amount": 50445,
      "requested_by": "Jane Smith",
      "requested_at": "2026-06-12T09:00:00Z",
      "status": "pending",
      "priority": "high"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10
}
```

---

### 7.2 Manager: Get Approval Detail

```
GET /approvals/:approvalId                  ✅ Manager | 🛒 Procurement Officer
```

**Response `200`:**
```json
{
  "approval_id": "uuid",
  "status": "pending",
  "rfq": { "rfq_number": "RFQ-2026-0001", "title": "Steel Rods Q2 2026" },
  "selected_quotation": {
    "vendor_name": "Steel Suppliers Ltd",
    "total_amount": 50445,
    "delivery_days": 14,
    "quotation_pdf_url": "https://cdn/QT-2026-0001.pdf"
  },
  "timeline": [
    { "event": "RFQ Created", "by": "Jane Smith", "at": "2026-06-01T10:00:00Z" },
    { "event": "Quotations Received", "by": "System", "at": "2026-06-10T12:00:00Z" },
    { "event": "Vendor Shortlisted", "by": "Jane Smith", "at": "2026-06-12T09:00:00Z" }
  ],
  "requested_by": "Jane Smith",
  "requested_at": "2026-06-12T09:00:00Z"
}
```

---

### 7.3 Manager: Approve or Reject

```
PATCH /approvals/:approvalId/action         ✅ Manager
```

**Request Body:**
```json
{
  "action": "approved",
  "remarks": "Price is within budget. Proceed with PO generation."
}
```
> `action` can be `approved` | `rejected`

**Response `200`:**
```json
{
  "success": true,
  "action": "approved",
  "message": "Procurement approved. Procurement Officer can now generate PO.",
  "approval_id": "uuid"
}
```

---

### 7.4 Procurement Officer: List My Approval Requests

```
GET /rfq/:rfqId/approval-status            🛒 Procurement Officer
```

---

## 8. PURCHASE ORDERS (PO)

### 8.1 Generate PO (only after approval)

```
POST /po                                    🛒 Procurement Officer
```

**Request Body:**
```json
{
  "rfq_id": "uuid",
  "quotation_id": "uuid",
  "approval_id": "uuid",
  "delivery_address": "Acme Corp, Plot 45, Pune - 411018",
  "expected_delivery_date": "2026-07-15",
  "payment_terms": "Net 30 days",
  "special_instructions": "Deliver to Gate 2, contact Ravi"
}
```

**Response `201`:**
```json
{
  "success": true,
  "po_id": "uuid",
  "po_number": "PO-2026-0001",
  "pdf_url": "https://cdn/generated/PO-2026-0001.pdf",
  "message": "Purchase Order generated and sent to vendor"
}
```

---

### 8.2 List All POs

```
GET /po                                     🛒 Procurement Officer | 👑 Admin | ✅ Manager
```

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | `generated`,`acknowledged`,`in_transit`,`delivered`,`cancelled` |
| `vendor_id` | uuid | Filter by vendor |
| `date_from` | date | From date filter |
| `date_to` | date | To date filter |
| `page` | number | Pagination |
| `limit` | number | Items per page |

---

### 8.3 Get Single PO

```
GET /po/:poId                               🛒 Procurement Officer | 👑 Admin | ✅ Manager | 🏪 Vendor (own POs)
```

**Response `200`:**
```json
{
  "po_id": "uuid",
  "po_number": "PO-2026-0001",
  "rfq_number": "RFQ-2026-0001",
  "vendor": {
    "id": "uuid",
    "company_name": "Steel Suppliers Ltd",
    "gst_number": "27AAAPL1234C1Z5"
  },
  "items": [
    {
      "product_name": "Steel Rod 10mm",
      "quantity": 500,
      "unit": "pieces",
      "unit_price": 85.50,
      "subtotal": 42750,
      "tax_percent": 18,
      "tax_amount": 7695,
      "total": 50445
    }
  ],
  "subtotal": 42750,
  "tax_total": 7695,
  "grand_total": 50445,
  "status": "generated",
  "delivery_address": "Acme Corp, Plot 45, Pune - 411018",
  "expected_delivery_date": "2026-07-15",
  "payment_terms": "Net 30 days",
  "pdf_url": "https://cdn/generated/PO-2026-0001.pdf",
  "created_at": "2026-06-13T10:00:00Z"
}
```

---

### 8.4 Download PO PDF

```
GET /po/:poId/download                      🛒 Procurement Officer | 🏪 Vendor | 👑 Admin
```

> Returns PDF binary (`Content-Type: application/pdf`)

---

### 8.5 Send PO via Email

```
POST /po/:poId/send-email                   🛒 Procurement Officer
```

**Request Body:**
```json
{
  "recipient_email": "raj@steelsuppliers.com",
  "message": "Please find attached the PO for Steel Rods Q2 2026."
}
```

---

### 8.6 Update PO Status

```
PATCH /po/:poId/status                      🛒 Procurement Officer | 🏪 Vendor
```

**Request Body:**
```json
{
  "status": "acknowledged",
  "remarks": "PO received, will deliver by July 12."
}
```
> Vendor can update: `acknowledged` | `in_transit` | `delivered`  
> PO can be `cancelled` only by Procurement Officer

---

### 8.7 Vendor: List My POs

```
GET /vendor/po                              🏪 Vendor
```

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by PO status |
| `page` | number | Pagination |

---

## 9. INVOICES

### 9.1 Vendor: Generate Invoice for a PO

```
POST /vendor/po/:poId/invoice               🏪 Vendor
```

**Request Body:**
```json
{
  "invoice_date": "2026-07-16",
  "invoice_number_vendor": "INV-SS-2026-045",
  "items": [
    {
      "product_name": "Steel Rod 10mm",
      "quantity": 500,
      "unit": "pieces",
      "unit_price": 85.50,
      "subtotal": 42750,
      "tax_percent": 18,
      "tax_amount": 7695,
      "total": 50445
    }
  ],
  "subtotal": 42750,
  "tax_total": 7695,
  "grand_total": 50445,
  "bank_name": "HDFC Bank",
  "bank_account": "12345678901234",
  "bank_ifsc": "HDFC0001234",
  "due_date": "2026-08-15",
  "notes": "Payment due within 30 days"
}
```

**Response `201`:**
```json
{
  "success": true,
  "invoice_id": "uuid",
  "invoice_number": "INV-2026-0001",
  "pdf_url": "https://cdn/generated/INV-2026-0001.pdf",
  "message": "Invoice generated and sent to Procurement Officer"
}
```

---

### 9.2 List All Invoices

```
GET /invoices                               🛒 Procurement Officer | 👑 Admin | ✅ Manager
```

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | `pending`,`paid`,`overdue`,`disputed` |
| `vendor_id` | uuid | Filter by vendor |
| `date_from` | date | From date |
| `date_to` | date | To date |
| `page` | number | Pagination |

---

### 9.3 Get Single Invoice

```
GET /invoices/:invoiceId                    🛒 Procurement Officer | 👑 Admin | ✅ Manager | 🏪 Vendor (own)
```

---

### 9.4 Download Invoice PDF

```
GET /invoices/:invoiceId/download           🛒 Procurement Officer | 🏪 Vendor | 👑 Admin
```

> Returns PDF binary

---

### 9.5 Send Invoice via Email

```
POST /invoices/:invoiceId/send-email        🛒 Procurement Officer | 🏪 Vendor
```

**Request Body:**
```json
{
  "recipient_email": "finance@acme.com",
  "message": "Please process the invoice for PO-2026-0001."
}
```

---

### 9.6 Update Invoice Payment Status

```
PATCH /invoices/:invoiceId/status           🛒 Procurement Officer | 👑 Admin
```

**Request Body:**
```json
{
  "status": "paid",
  "payment_date": "2026-08-10",
  "payment_reference": "NEFT-TXN-12345",
  "remarks": "Payment completed"
}
```

---

### 9.7 Vendor: List My Invoices

```
GET /vendor/invoices                        🏪 Vendor
```

---

### 9.8 Vendor: Get Single Invoice

```
GET /vendor/invoices/:invoiceId             🏪 Vendor
```

---

## 10. ACTIVITY LOGS & NOTIFICATIONS

### 10.1 Get Activity Log (Global)

```
GET /activity-logs                          👑 Admin | ✅ Manager
```

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `entity_type` | string | `rfq`,`quotation`,`po`,`invoice`,`user`,`vendor` |
| `entity_id` | uuid | Filter by specific entity |
| `user_id` | uuid | Filter by who performed action |
| `date_from` | date | From date |
| `date_to` | date | To date |
| `page` | number | Pagination |

**Response `200`:**
```json
{
  "logs": [
    {
      "log_id": "uuid",
      "entity_type": "rfq",
      "entity_id": "uuid",
      "entity_ref": "RFQ-2026-0001",
      "action": "rfq_sent",
      "description": "RFQ sent to 3 vendors",
      "performed_by": "Jane Smith",
      "role": "procurement_officer",
      "timestamp": "2026-06-01T10:00:00Z",
      "ip_address": "192.168.1.1"
    }
  ],
  "total": 250,
  "page": 1,
  "limit": 20
}
```

---

### 10.2 Get My Notifications

```
GET /notifications                          🔄 All roles
```

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `is_read` | boolean | Filter read/unread |
| `type` | string | `rfq`,`quotation`,`approval`,`po`,`invoice` |
| `page` | number | Pagination |

**Response `200`:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "approval",
      "title": "Approval Required",
      "message": "RFQ-2026-0001 is awaiting your approval",
      "entity_type": "rfq",
      "entity_id": "uuid",
      "is_read": false,
      "created_at": "2026-06-12T09:00:00Z"
    }
  ],
  "unread_count": 3,
  "total": 15
}
```

---

### 10.3 Mark Notification as Read

```
PATCH /notifications/:notificationId/read   🔄 All roles
```

---

### 10.4 Mark All Notifications as Read

```
PATCH /notifications/read-all               🔄 All roles
```

---

### 10.5 Get Unread Notification Count

```
GET /notifications/unread-count             🔄 All roles
```

**Response `200`:**
```json
{ "unread_count": 3 }
```

---

## 11. DASHBOARD

### 11.1 Admin Dashboard Stats

```
GET /dashboard/admin                        👑 Admin
```

**Response `200`:**
```json
{
  "total_users": 12,
  "total_vendors": 45,
  "active_rfqs": 8,
  "pending_approvals": 3,
  "total_pos_this_month": 15,
  "total_spend_this_month": 1250000,
  "total_invoices_pending": 6,
  "recent_rfqs": [...],
  "recent_pos": [...],
  "spend_by_category": [
    { "category": "Raw Materials", "amount": 750000 },
    { "category": "IT Equipment", "amount": 500000 }
  ]
}
```

---

### 11.2 Procurement Officer Dashboard

```
GET /dashboard/procurement                  🛒 Procurement Officer
```

**Response `200`:**
```json
{
  "my_active_rfqs": 5,
  "my_pending_approvals": 2,
  "my_pos_this_month": 8,
  "quotations_received_today": 3,
  "recent_rfqs": [...],
  "recent_pos": [...],
  "quick_actions": {
    "create_rfq": true,
    "compare_quotations": true
  }
}
```

---

### 11.3 Manager Dashboard

```
GET /dashboard/manager                      ✅ Manager
```

**Response `200`:**
```json
{
  "pending_approvals": 4,
  "approved_this_month": 18,
  "rejected_this_month": 2,
  "total_spend_approved": 3250000,
  "recent_approvals": [...],
  "approval_trend": [
    { "month": "Jan", "approved": 12, "rejected": 1 }
  ]
}
```

---

### 11.4 Vendor Dashboard

```
GET /dashboard/vendor                       🏪 Vendor
```

**Response `200`:**
```json
{
  "active_rfqs_received": 3,
  "quotations_submitted": 12,
  "quotations_accepted": 4,
  "active_pos": 2,
  "pending_invoices": 1,
  "total_revenue_this_month": 250000,
  "recent_rfqs": [...],
  "recent_pos": [...]
}
```

---

## 12. REPORTS & ANALYTICS

### 12.1 Procurement Summary Report

```
GET /reports/procurement-summary            👑 Admin | ✅ Manager | 🛒 Procurement Officer
```

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `date_from` | date | From date |
| `date_to` | date | To date |
| `vendor_id` | uuid | Filter by vendor |
| `category` | string | Filter by category |
| `format` | string | `json` | `csv` | `pdf` |

**Response `200` (JSON):**
```json
{
  "period": { "from": "2026-01-01", "to": "2026-06-30" },
  "total_rfqs_created": 45,
  "total_quotations_received": 132,
  "total_pos_generated": 38,
  "total_invoices": 35,
  "total_spend": 12500000,
  "avg_quotation_response_time_days": 4.2,
  "avg_approval_time_hours": 18.5,
  "top_vendors": [
    { "vendor_id": "uuid", "vendor_name": "Steel Suppliers Ltd", "total_orders": 12, "total_value": 4200000 }
  ]
}
```

---

### 12.2 Monthly Spend Trend

```
GET /reports/spend-trend                    👑 Admin | ✅ Manager
```

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `year` | number | Year (e.g. 2026) |
| `category` | string | Optional category filter |

**Response `200`:**
```json
{
  "year": 2026,
  "monthly_trend": [
    { "month": "January", "month_num": 1, "total_spend": 1200000, "po_count": 8 },
    { "month": "February", "month_num": 2, "total_spend": 980000, "po_count": 6 }
  ]
}
```

---

### 12.3 Vendor Performance Analytics

```
GET /reports/vendor-performance             👑 Admin | ✅ Manager | 🛒 Procurement Officer
```

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `vendor_id` | uuid | Specific vendor (optional) |
| `date_from` | date | From date |
| `date_to` | date | To date |

**Response `200`:**
```json
{
  "vendors": [
    {
      "vendor_id": "uuid",
      "vendor_name": "Steel Suppliers Ltd",
      "total_rfqs_received": 20,
      "quotations_submitted": 18,
      "quotations_accepted": 12,
      "acceptance_rate": 66.7,
      "avg_delivery_time_days": 12.5,
      "on_time_delivery_rate": 91.6,
      "total_value_awarded": 4200000,
      "avg_rating": 4.5
    }
  ]
}
```

---

### 12.4 Approval Workflow Analytics

```
GET /reports/approval-analytics             👑 Admin | ✅ Manager
```

**Response `200`:**
```json
{
  "total_requests": 48,
  "approved": 40,
  "rejected": 6,
  "pending": 2,
  "avg_approval_time_hours": 18.5,
  "approval_by_manager": [
    { "manager_name": "Ravi Sharma", "approved": 20, "rejected": 3 }
  ]
}
```

---

### 12.5 Spending by Category

```
GET /reports/spend-by-category              👑 Admin | ✅ Manager | 🛒 Procurement Officer
```

**Query Params:** `date_from`, `date_to`

---

### 12.6 Export Report

```
POST /reports/export                        👑 Admin | ✅ Manager | 🛒 Procurement Officer
```

**Request Body:**
```json
{
  "report_type": "procurement_summary",
  "format": "csv",
  "date_from": "2026-01-01",
  "date_to": "2026-06-30"
}
```

> Returns file download (`Content-Type: text/csv` or `application/pdf`)

---

### 12.7 Vendor: My Performance Stats

```
GET /vendor/reports/performance             🏪 Vendor
```

**Response `200`:**
```json
{
  "total_rfqs_received": 20,
  "quotations_submitted": 18,
  "acceptance_rate": 66.7,
  "on_time_delivery_rate": 91.6,
  "total_revenue": 4200000,
  "avg_rating": 4.5,
  "monthly_revenue": [
    { "month": "January", "revenue": 350000 }
  ]
}
```

---

## 13. FILE UPLOADS

### 13.1 Upload Attachment

```
POST /upload                                🔄 All roles
```

**Request:** `multipart/form-data`  
| Field | Type | Description |
|-------|------|-------------|
| `file` | File | The file to upload |
| `entity_type` | string | `rfq` \| `quotation` \| `po` \| `invoice` |

**Response `200`:**
```json
{
  "success": true,
  "file_url": "https://cdn/uploads/uuid-filename.pdf",
  "file_name": "specification.pdf",
  "file_size": 204800,
  "mime_type": "application/pdf"
}
```

---

## 14. COMPLETE ROLE PERMISSION MATRIX

| Endpoint Area | Admin | Procurement Officer | Manager | Vendor |
|--------------|:-----:|:-------------------:|:-------:|:------:|
| Register Org | ✅ (creates) | ❌ | ❌ | ❌ |
| Login | ✅ | ✅ | ✅ | ✅ |
| Forgot/Reset Password | ✅ | ✅ | ✅ | ✅ |
| Invite Users | ✅ | ❌ | ❌ | ❌ |
| Manage Users | ✅ Full CRUD | ❌ | ❌ | ❌ |
| Create Vendor | ✅ | ❌ | ❌ | ❌ |
| View Vendors | ✅ | ✅ | Read | Own profile |
| Approve Vendor | ✅ | ❌ | ❌ | ❌ |
| Create RFQ | ❌ | ✅ | ❌ | ❌ |
| View RFQs | ✅ | ✅ | ✅ | Own RFQs |
| Submit Quotation | ❌ | ❌ | ❌ | ✅ |
| Compare Quotations | ❌ | ✅ | ✅ (view) | ❌ |
| Shortlist Vendor | ❌ | ✅ | ❌ | ❌ |
| Approve/Reject | ❌ | ❌ | ✅ | ❌ |
| Generate PO | ❌ | ✅ (post-approval) | ❌ | ❌ |
| View POs | ✅ | ✅ | ✅ | Own POs |
| Generate Invoice | ❌ | ❌ | ❌ | ✅ |
| View Invoices | ✅ | ✅ | ✅ | Own invoices |
| Update Invoice Status | ✅ | ✅ | ❌ | ❌ |
| View Activity Logs | ✅ Full | ❌ | ✅ | ❌ |
| Notifications | ✅ | ✅ | ✅ | ✅ |
| Dashboard | Admin view | PO view | Manager view | Vendor view |
| Reports & Analytics | ✅ Full | ✅ Partial | ✅ Full | Own stats |

---

## 15. STANDARD ERROR RESPONSES

```json
// 400 Bad Request
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Email is required",
  "details": [{ "field": "email", "issue": "required" }]
}

// 401 Unauthorized
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Invalid or expired token"
}

// 403 Forbidden
{
  "success": false,
  "error": "FORBIDDEN",
  "message": "You do not have permission to perform this action"
}

// 404 Not Found
{
  "success": false,
  "error": "NOT_FOUND",
  "message": "RFQ not found"
}

// 409 Conflict
{
  "success": false,
  "error": "CONFLICT",
  "message": "A quotation has already been submitted for this RFQ"
}

// 422 Unprocessable Entity
{
  "success": false,
  "error": "BUSINESS_RULE_VIOLATION",
  "message": "Cannot generate PO without manager approval"
}

// 500 Internal Server Error
{
  "success": false,
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Something went wrong. Please try again."
}
```

---

## 16. JWT PAYLOAD STRUCTURE

```json
{
  "sub": "uuid",
  "name": "Jane Smith",
  "email": "jane@acme.com",
  "role": "procurement_officer",
  "org_id": "uuid",
  "iat": 1717200000,
  "exp": 1717286400
}
```

> **Token Expiry:** Access token = 24h | Refresh token = 7 days

---

## 17. ROUTE SUMMARY QUICK REFERENCE

```
AUTH
  POST   /auth/register-org
  POST   /auth/login
  POST   /auth/refresh-token
  POST   /auth/logout
  POST   /auth/forgot-password
  POST   /auth/reset-password
  PUT    /auth/change-password
  GET    /auth/me
  PUT    /auth/me

ORG
  GET    /org/me
  PUT    /org/me

ADMIN - USERS
  POST   /admin/users/invite
  GET    /admin/users
  GET    /admin/users/:userId
  PUT    /admin/users/:userId
  PATCH  /admin/users/:userId/status
  POST   /admin/users/:userId/reset-password
  DELETE /admin/users/:userId

ADMIN - VENDORS
  POST   /admin/vendors
  GET    /admin/vendors
  GET    /admin/vendors/:vendorId
  PUT    /admin/vendors/:vendorId
  PATCH  /admin/vendors/:vendorId/status
  DELETE /admin/vendors/:vendorId

VENDOR SELF
  GET    /vendor/profile
  PUT    /vendor/profile
  GET    /vendor/rfqs
  GET    /vendor/rfqs/:rfqId
  POST   /vendor/rfqs/:rfqId/quotation
  PUT    /vendor/rfqs/:rfqId/quotation/:quotationId
  GET    /vendor/quotations
  GET    /vendor/quotations/:quotationId
  GET    /vendor/po
  GET    /vendor/po/:poId (alias)
  PATCH  /po/:poId/status
  POST   /vendor/po/:poId/invoice
  GET    /vendor/invoices
  GET    /vendor/invoices/:invoiceId
  GET    /vendor/reports/performance
  GET    /dashboard/vendor

RFQ
  POST   /rfq
  GET    /rfq
  GET    /rfq/:rfqId
  PUT    /rfq/:rfqId
  PATCH  /rfq/:rfqId/cancel
  POST   /rfq/:rfqId/vendors
  GET    /rfq/:rfqId/quotations
  GET    /rfq/:rfqId/quotations/compare
  PATCH  /rfq/:rfqId/quotations/:quotationId/select
  GET    /rfq/:rfqId/approval-status

APPROVALS
  GET    /approvals
  GET    /approvals/:approvalId
  PATCH  /approvals/:approvalId/action

PURCHASE ORDERS
  POST   /po
  GET    /po
  GET    /po/:poId
  GET    /po/:poId/download
  POST   /po/:poId/send-email
  PATCH  /po/:poId/status

INVOICES
  GET    /invoices
  GET    /invoices/:invoiceId
  GET    /invoices/:invoiceId/download
  POST   /invoices/:invoiceId/send-email
  PATCH  /invoices/:invoiceId/status

NOTIFICATIONS
  GET    /notifications
  PATCH  /notifications/:id/read
  PATCH  /notifications/read-all
  GET    /notifications/unread-count

ACTIVITY LOGS
  GET    /activity-logs

DASHBOARDS
  GET    /dashboard/admin
  GET    /dashboard/procurement
  GET    /dashboard/manager
  GET    /dashboard/vendor

REPORTS
  GET    /reports/procurement-summary
  GET    /reports/spend-trend
  GET    /reports/vendor-performance
  GET    /reports/approval-analytics
  GET    /reports/spend-by-category
  POST   /reports/export

UPLOADS
  POST   /upload
```
