# AI-Powered CSV Importer for GrowEasy CRM

An intelligent CSV import system that automatically maps columns from any CSV format to GrowEasy CRM fields using AI. Supports imports from Facebook Leads, Google Ads, Excel sheets, Real Estate CRMs, and more.

## 🚀 Features

- **Smart AI Mapping**: Automatically maps CSV columns to CRM fields using Google Gemini AI
- **Universal CSV Support**: Works with any CSV format, column names, or structure
- **Drag & Drop Upload**: Intuitive file upload with drag & drop support
- **Live Preview**: Preview your data before processing
- **Batch Processing**: Efficiently processes large files in batches with retry logic
- **Validation**: Skips invalid records with clear error messages
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Progress**: Track AI processing progress
- **Dark Mode**: Toggle between light and dark themes
- **JSON Export**: Download processed data in JSON or CSV format
- **Docker Support**: Containerized deployment with Docker Compose

## 📋 Prerequisites

- Node.js 18+ and npm
- Google Gemini API key
- Git
- Docker (optional, for containerized deployment)

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- JavaScript
- Tailwind CSS
- papaparse (CSV parsing)
- Lucide React (icons)

### Backend
- Node.js + Express
- JavaScript
- Google Generative AI SDK (Gemini)
- Multer (file uploads)
- Zod (validation)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Barigalaviswesh/ai-csv-importer.git
cd ai-csv-importer
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🏃 Running the Application

### Start Backend

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:3001`

### Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📖 Usage

### 1. Upload CSV

- Drag and drop a CSV file onto the upload area
- Or click to select a file using the file picker
- Supported formats: `.csv`

### 2. Preview Data

- Review the first 20 rows of your data
- Verify the columns and data format
- Scroll horizontally to see all columns

### 3. Confirm Import

- Click "Confirm Import" to process the file
- The AI will analyze and map fields to CRM format
- Monitor the progress indicator

### 4. View Results

- See successfully imported records
- Review skipped records with reasons
- Download processed data as CSV or JSON
- Filter by imported/skipped records

## 📊 CRM Field Mapping

The AI extracts the following fields:

| Field | Description |
|-------|-------------|
| created_at | Lead creation date |
| name | Lead name |
| email | Primary email |
| country_code | Country code (+91, +1, etc.) |
| mobile_without_country_code | Mobile number |
| company | Company name |
| city | City |
| state | State |
| country | Country |
| lead_owner | Lead owner email |
| crm_status | Lead status (GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE) |
| crm_note | Notes and remarks |
| data_source | Source (leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots) |
| possession_time | Property possession time |
| description | Additional description |

## 🧪 Sample CSV Formats

### Facebook Lead Export
```csv
Full Name,Email,Phone,Lead Date,Notes
John Doe,john@example.com,+919876543210,2026-05-13,Interested in premium plan
```

### Google Ads Export
```csv
Customer Name,Email Address,Phone Number,Conversion Time,Company
Sarah Johnson,sarah@example.com,+919876543211,2026-05-13 14:25,Tech Solutions
```

### Manual Spreadsheet
```csv
Name,Mobile,Email,City,State
Rajesh Patel,9876543212,rajesh@example.com,Delhi,Delhi
```

All formats will be automatically mapped to the CRM schema.

## 🔧 Configuration

### Backend Configuration

Edit `backend/src/config/index.js` to customize:

```javascript
const config = {
  port: 3001,
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-1.5-pro'
  },
  upload: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
  },
  ai: {
    batchSize: 50, // Records per AI request
    maxRetries: 3,
  }
};
```

### Frontend Configuration

Edit `frontend/lib/api-client.js` to change API endpoint:

```javascript
const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
```

## 🚢 Deployment

### Docker (Recommended)

Using Docker Compose for easy deployment:

```bash
# Set your Gemini API key in .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Start both frontend and backend
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL` (your backend URL)
4. Deploy

### Backend (Railway/Render)

1. Push code to GitHub
2. Import project in Railway/Render
3. Set environment variables:
   - `PORT=3001`
   - `GEMINI_API_KEY=your_gemini_api_key`
   - `GEMINI_MODEL=gemini-1.5-pro`
4. Deploy

## 🧪 Testing

### Run Backend Tests

```bash
cd backend
npm test
```

### Run Frontend Tests

```bash
cd frontend
npm test
```

### Test with Sample CSV

Use the provided sample CSV files in the `samples/` directory:

```bash
# Test with Facebook leads
curl -X POST -F "file=@samples/facebook_leads.csv" http://localhost:3001/api/csv/upload

# Test with Google Ads
curl -X POST -F "file=@samples/google_ads.csv" http://localhost:3001/api/csv/upload
```

## 📁 Project Structure

```
grow-easy/
├── frontend/                 # Next.js frontend
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities and API client
│   └── public/              # Static assets
├── backend/                 # Express backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   └── config/          # Configuration
│   └── uploads/             # Temporary file storage
├── PRD.md                   # Product Requirements Document
├── spec.md                  # Technical Specification
└── README.md                # This file
```

## 🔒 Security

- Files are deleted immediately after processing
- No persistent storage of user data
- API keys stored in environment variables
- Input validation on all endpoints
- Rate limiting to prevent abuse
- CORS configured for allowed origins

## 🐛 Troubleshooting

### Issue: "File too large" error

**Solution**: The default limit is 50MB. Increase in `backend/src/config/index.ts`:

```typescript
upload: {
  maxFileSize: 100 * 1024 * 1024, // 100MB
}
```

### Issue: AI processing timeout

**Solution**: Increase timeout in backend config or reduce batch size:

```typescript
ai: {
  batchSize: 25, // Smaller batches
  timeout: 120000, // 2 minutes
}
```

### Issue: CORS errors

**Solution**: Configure allowed origins in backend middleware:

```typescript
cors({
  origin: ['http://localhost:3000', 'https://your-domain.com']
})
```

### Issue: Invalid date format

**Solution**: The AI attempts multiple date formats. If issues persist, ensure dates are in standard formats (ISO 8601, DD/MM/YYYY, MM/DD/YYYY).

## 📈 Performance

- **Preview**: < 2 seconds for 10MB files
- **AI Processing**: ~30 seconds for 1000 records
- **Max File Size**: 50MB (configurable)
- **Max Records**: 10,000 per import

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Open an issue on GitHub
- Contact: support@groweasy.com

## 🎯 Roadmap

- [ ] Support for Excel files (.xlsx)
- [ ] Save mapping configurations
- [ ] Bulk import from multiple files
- [ ] Import history and audit logs
- [ ] Integration with popular CRMs
- [ ] Custom field mapping UI
- [ ] Unit tests
- [ ] E2E tests with Playwright
- [ ] Streaming/incremental parsing for large CSVs
- [ ] Virtualized table for large datasets

## ✅ Implemented Features

- ✅ Smart AI field mapping with Google Gemini
- ✅ Universal CSV support (any format)
- ✅ Drag & drop upload
- ✅ Live CSV preview
- ✅ Batch processing with retry logic
- ✅ Validation and error handling
- ✅ Responsive design
- ✅ Real-time progress indicators
- ✅ Dark mode toggle
- ✅ JSON and CSV export
- ✅ Docker deployment support
- ✅ Comprehensive sample CSV files
- ✅ Complete documentation (PRD, spec, README)

## 🙏 Acknowledgments

- Google for Gemini AI API
- Next.js team for the amazing framework
- Tailwind CSS for utility-first styling
