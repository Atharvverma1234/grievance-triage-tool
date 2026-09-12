import { useState } from 'react';
import api from '../api';
import AppShell from '../components/AppShell';
import LocationPicker from '../components/LocationPicker';
import { useSpeechToText } from '../hooks/useSpeechToText';

export default function SubmitComplaint() {
  const [rawText, setRawText] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState(null);
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [voiceLang, setVoiceLang] = useState('hi-IN');
  const { listening, supported, startListening, stopListening } = useSpeechToText(voiceLang);

  const handleVoiceInput = () => {
    if (listening) stopListening();
    else startListening(t => setRawText(prev => prev ? `${prev} ${t}` : t));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const formData = new FormData();
      formData.append('rawText', rawText);
      formData.append('location', location);
      if (coords) {
        formData.append('locationLat', coords.lat);
        formData.append('locationLng', coords.lng);
      }
      if (photo) formData.append('photo', photo);

      const res = await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
      setRawText(''); setLocation(''); setPhoto(null); setCoords(null);
      const fileInput = document.getElementById('photo');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed — try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="page-wide">
        <div className="page-header">
          <h1>Report an issue</h1>
          <p className="page-subtitle">
            Describe the issue in English, Hindi, or your preferred language — AI will classify it and route it to the right department.
          </p>
        </div>

        {error && <div className="banner banner-error">{error}</div>}

        {result && (
          <div className="ai-card">
            <div className="ai-card-header">
              <span className="ai-badge">AI analysis</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Complaint submitted</span>
            </div>
            <p className="ai-summary">{result.summary}</p>
            <div className="ai-grid">
              <div>
                <div className="ai-meta-label">Category</div>
                <div style={{ textTransform: 'capitalize' }}>{result.category?.replace(/_/g, ' ') || 'Unknown'}</div>
              </div>
              <div>
                <div className="ai-meta-label">Urgency</div>
                <div className="urgency-dot" style={{ color: `var(--urgency-${result.urgency || 'medium'})` }}>
                  {result.urgency || 'Unknown'}
                </div>
              </div>
              <div>
                <div className="ai-meta-label">Routed to</div>
                <div>{result.department || 'Not assigned'}</div>
              </div>
              <div>
                <div className="ai-meta-label">Language</div>
                <div>{result.detectedLanguage || 'Unknown'}</div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="submit-grid">
          {/* Left column: complaint details + submit */}
          <div>
            <div className="field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="field-label" htmlFor="rawText" style={{ marginBottom: 0 }}>What's the issue?</label>
                {supported && (
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <select value={voiceLang} onChange={e => setVoiceLang(e.target.value)} className="field-select" style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem', width: 'auto' }}>
                      <option value="hi-IN">Hindi</option>
                      <option value="en-IN">English</option>
                      <option value="ta-IN">Tamil</option>
                      <option value="bn-IN">Bengali</option>
                      <option value="mr-IN">Marathi</option>
                      <option value="kn-IN">Kannada</option>
                    </select>
                    <button type="button" onClick={handleVoiceInput} className="btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: listening ? 'var(--urgency-high)' : 'var(--accent)' }}>
                      {listening ? '● Stop' : '🎙 Speak'}
                    </button>
                  </div>
                )}
              </div>
              <textarea
                id="rawText"
                className="field-textarea"
                placeholder="e.g. सड़क पर बड़ा गड्ढा है, गाड़ियाँ फिसल रही हैं — या अंग्रेज़ी में लिखें"
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                style={{ minHeight: 160 }}
                required
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="location">Location / Ward</label>
              <input id="location" className="field-input" placeholder="e.g. Ward 5, near the market" value={location} onChange={e => setLocation(e.target.value)} />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="photo">Photo (optional)</label>
              <input id="photo" type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)} style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }} />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Analyzing and submitting…' : 'Submit complaint'}
            </button>
          </div>

          {/* Right column: map pin */}
          <div className="map-panel">
            <div className="map-panel-label">Pin exact location (optional)</div>
            <LocationPicker onLocationChange={setCoords} />
            <p className="map-panel-hint">
              Pinning the exact spot helps officials find the issue faster, especially if the ward or landmark text isn't precise.
            </p>
          </div>
        </form>
      </div>
    </AppShell>
  );
}