import { useState, type FormEvent, type MouseEvent } from 'react'
import { supabase } from '../supabaseClient'
import Aside from '../components/Aside'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export default function Contact() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!form.name.trim()) e.name = 'Name is required.'
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters.'
    if (!form.email.trim()) e.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address.'
    if (!form.subject.trim()) e.subject = 'Subject is required.'
    else if (form.subject.trim().length < 5) e.subject = 'Subject must be at least 5 characters.'
    if (!form.message.trim()) e.message = 'Message is required.'
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters.'
    return e
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setSubmitting(true)
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    })
    setSubmitting(false)
    if (error) {
      setSuccess(false)
    } else {
      setSuccess(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    }
  }

  const handleReset = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setForm({ name: '', email: '', subject: '', message: '' })
    setErrors({})
    setSuccess(false)
  }

  const handleMouseOver = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.classList.add('btn-mouseover')
  }

  const handleMouseOut = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.classList.remove('btn-mouseover')
  }

  return (
    <div className="container">
      <div className="page-title">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you. Send us a message below.</p>
      </div>
      <div className="page-layout">
        <div className="page-main">
          <div className="contact-info-grid">
            <div className="contact-info-item">
              <h4>Visit Us</h4>
              <p>12 Vineyard Road<br />Devon Valley, SA 5001</p>
            </div>
            <div className="contact-info-item">
              <h4>Call Us</h4>
              <p>(08) 8123 4567<br />Mon–Sat, 9am–6pm</p>
            </div>
            <div className="contact-info-item">
              <h4>Email Us</h4>
              <p>info@devonvalleywine.com<br />sales@devonvalleywine.com</p>
            </div>
          </div>

          {success && (
            <div className="alert alert-success">
              Thank you for your message! We'll get back to you within 48 hours.
            </div>
          )}

          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Send Us a Message</h3>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="name"
                    className={`form-input ${errors.name ? 'invalid' : ''}`}
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    placeholder="Your full name"
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email <span className="required">*</span></label>
                  <input
                    type="email"
                    id="email"
                    className={`form-input ${errors.email ? 'invalid' : ''}`}
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder="your@email.com"
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject <span className="required">*</span></label>
                <input
                  type="text"
                  id="subject"
                  className={`form-input ${errors.subject ? 'invalid' : ''}`}
                  value={form.subject}
                  onChange={e => handleChange('subject', e.target.value)}
                  placeholder="What is this about?"
                />
                {errors.subject && <span className="form-error">{errors.subject}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="message">Message <span className="required">*</span></label>
                <textarea
                  id="message"
                  className={`form-textarea ${errors.message ? 'invalid' : ''}`}
                  value={form.message}
                  onChange={e => handleChange('message', e.target.value)}
                  placeholder="Tell us how we can help..."
                />
                {errors.message && <span className="form-error">{errors.message}</span>}
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  className="btn btn-submit"
                  disabled={submitting}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {submitting ? 'Sending...' : 'Submit'}
                </button>
                <button
                  type="reset"
                  className="btn btn-reset"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
        <Aside />
      </div>
    </div>
  )
}
