'use client'

import { useNode } from '@craftjs/core'
import { useState } from 'react'
import { Send, Loader2, CheckCircle2, Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ColorPicker } from '../controls/ColorPicker'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { useParishContext } from '../contexts/ParishContext'
import { createClient } from '@/lib/supabase/client'

interface ContactFormProps {
  title?: string
  description?: string
  showPhone?: boolean
  showSubject?: boolean
  submitButtonText?: string
  successMessage?: string
  // Theme-aware colors
  textColor?: string
  mutedTextColor?: string
  accentColor?: string
  cardBackground?: string
  cardBorder?: string
}

export function ContactForm({ 
  title,
  description,
  showPhone = false,
  showSubject = true,
  submitButtonText = 'Send Message',
  successMessage = 'Thank you for your message! We will get back to you soon.',
  textColor = '',
  mutedTextColor = '',
  accentColor = '',
  cardBackground = '',
  cardBorder = '',
}: ContactFormProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const { parishId, isEditorMode } = useParishContext()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!parishId) {
      setError('Unable to submit form. Please try again later.')
      return
    }

    if (isEditorMode) {
      // Don't actually submit in editor mode
      setSubmitted(true)
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      
      const { error: insertError } = await supabase
        .from('contact_submissions')
        .insert({
          parish_id: parishId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject || null,
          message: formData.message,
        })

      if (insertError) throw insertError

      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      console.error('Error submitting contact form:', err)
      setError('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const styles = {
    card: {
      backgroundColor: cardBackground || undefined,
      borderColor: cardBorder || undefined,
    },
    title: { color: textColor || 'inherit' },
    muted: { color: mutedTextColor || 'inherit', opacity: mutedTextColor ? 1 : 0.7 },
    accent: { color: accentColor || 'var(--gold-600)' },
  }

  if (submitted) {
    return (
      <Card
        ref={(ref) => {
          if (ref) {
            connect(drag(ref))
          }
        }}
        className={`${isSelected ? 'ring-2 ring-primary' : ''}`}
        style={styles.card}
      >
        <CardContent className="py-12 text-center">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <p className="text-lg font-medium" style={styles.title}>
            {successMessage}
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setSubmitted(false)}
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={styles.card}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={styles.title}>
          <Mail className="h-5 w-5" style={styles.accent} />
          {title || 'Contact Us'}
        </CardTitle>
        {description && (
          <p style={styles.muted}>{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="contact-name" style={styles.title}>Name *</Label>
              <Input
                id="contact-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Your name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="contact-email" style={styles.title}>Email *</Label>
              <Input
                id="contact-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder="your@email.com"
                className="mt-1"
              />
            </div>
          </div>

          {showPhone && (
            <div>
              <Label htmlFor="contact-phone" style={styles.title}>Phone</Label>
              <Input
                id="contact-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
                className="mt-1"
              />
            </div>
          )}

          {showSubject && (
            <div>
              <Label htmlFor="contact-subject" style={styles.title}>Subject</Label>
              <Input
                id="contact-subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="What is this regarding?"
                className="mt-1"
              />
            </div>
          )}

          <div>
            <Label htmlFor="contact-message" style={styles.title}>Message *</Label>
            <Textarea
              id="contact-message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              required
              placeholder="Your message..."
              rows={4}
              className="mt-1"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {submitButtonText}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function ContactFormSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <div className="divide-y divide-gray-100">
      <SettingsAccordion title="Content" defaultOpen>
        <div>
          <Label>Title</Label>
          <Input
            value={props.title || ''}
            onChange={(e) => setProp((props: any) => (props.title = e.target.value))}
            className="mt-1"
            placeholder="Contact Us"
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={props.description || ''}
            onChange={(e) => setProp((props: any) => (props.description = e.target.value))}
            className="mt-1"
            placeholder="We'd love to hear from you..."
            rows={2}
          />
        </div>
        <div>
          <Label>Submit Button Text</Label>
          <Input
            value={props.submitButtonText || ''}
            onChange={(e) => setProp((props: any) => (props.submitButtonText = e.target.value))}
            className="mt-1"
            placeholder="Send Message"
          />
        </div>
        <div>
          <Label>Success Message</Label>
          <Textarea
            value={props.successMessage || ''}
            onChange={(e) => setProp((props: any) => (props.successMessage = e.target.value))}
            className="mt-1"
            placeholder="Thank you for your message!"
            rows={2}
          />
        </div>
      </SettingsAccordion>

      <SettingsAccordion title="Fields">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showPhone"
            checked={props.showPhone || false}
            onChange={(e) => setProp((props: any) => (props.showPhone = e.target.checked))}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="showPhone" className="text-sm">Show phone number field</Label>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            id="showSubject"
            checked={props.showSubject !== false}
            onChange={(e) => setProp((props: any) => (props.showSubject = e.target.checked))}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="showSubject" className="text-sm">Show subject field</Label>
        </div>
      </SettingsAccordion>

      <SettingsAccordion title="Colors">
        <ColorPicker
          label="Text Color"
          value={props.textColor || ''}
          onChange={(value) => setProp((props: any) => (props.textColor = value))}
          placeholder="Inherit"
        />
        <ColorPicker
          label="Muted Text"
          value={props.mutedTextColor || ''}
          onChange={(value) => setProp((props: any) => (props.mutedTextColor = value))}
          placeholder="Inherit"
        />
        <ColorPicker
          label="Accent Color"
          value={props.accentColor || ''}
          onChange={(value) => setProp((props: any) => (props.accentColor = value))}
          placeholder="Gold"
        />
        <ColorPicker
          label="Card Background"
          value={props.cardBackground || ''}
          onChange={(value) => setProp((props: any) => (props.cardBackground = value))}
          placeholder="Default"
        />
        <ColorPicker
          label="Card Border"
          value={props.cardBorder || ''}
          onChange={(value) => setProp((props: any) => (props.cardBorder = value))}
          placeholder="Default"
        />
      </SettingsAccordion>
    </div>
  )
}

ContactForm.craft = {
  displayName: 'Contact Form',
  props: {
    title: 'Contact Us',
    description: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    showPhone: false,
    showSubject: true,
    submitButtonText: 'Send Message',
    successMessage: 'Thank you for your message! We will get back to you soon.',
    textColor: '',
    mutedTextColor: '',
    accentColor: '',
    cardBackground: '',
    cardBorder: '',
  },
  related: {
    settings: ContactFormSettings,
  },
}

