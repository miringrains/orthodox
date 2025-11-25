'use client'

import React from 'react'
import { Config } from '@measured/puck'
import { HeroSection } from './components/HeroSection'
import { SchedulePreview } from './components/SchedulePreview'
import { DonationPanel } from './components/DonationPanel'
import { NewsList } from './components/NewsList'
import { SermonCardGrid } from './components/SermonCardGrid'
import { GalleryGrid } from './components/GalleryGrid'
import { FeastHighlight } from './components/FeastHighlight'
import { TextBlock } from './components/TextBlock'
import { ImageBlock } from './components/ImageBlock'
import { ButtonBlock } from './components/ButtonBlock'

export const config: Config = {
  components: {
    // Basic Content Components
    TextBlock: {
      fields: {
        content: { 
          type: 'textarea', 
          label: 'Text Content',
          placeholder: 'Enter your text here...'
        },
        align: {
          type: 'select',
          label: 'Text Alignment',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
        size: {
          type: 'select',
          label: 'Text Size',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
            { label: 'Extra Large', value: 'xl' },
          ],
        },
      },
      defaultProps: {
        content: 'Enter your text here',
        align: 'left',
        size: 'md',
      },
      render: (props: any) => <TextBlock {...props} />,
    },
    ImageBlock: {
      fields: {
        imageUrl: { 
          type: 'text', 
          label: 'Image URL',
          placeholder: 'https://example.com/image.jpg'
        },
        alt: { 
          type: 'text', 
          label: 'Alt Text',
          placeholder: 'Description of image'
        },
        caption: { 
          type: 'text', 
          label: 'Caption (optional)',
        },
        width: { 
          type: 'number', 
          label: 'Aspect Ratio Width',
        },
        height: { 
          type: 'number', 
          label: 'Aspect Ratio Height',
        },
        objectFit: {
          type: 'select',
          label: 'Image Fit',
          options: [
            { label: 'Cover', value: 'cover' },
            { label: 'Contain', value: 'contain' },
            { label: 'Fill', value: 'fill' },
          ],
        },
      },
      defaultProps: {
        imageUrl: '',
        alt: 'Image',
        caption: '',
        width: 16,
        height: 9,
        objectFit: 'cover',
      },
      render: (props: any) => <ImageBlock {...props} />,
    },
    ButtonBlock: {
      fields: {
        text: { 
          type: 'text', 
          label: 'Button Text',
        },
        url: { 
          type: 'text', 
          label: 'Link URL',
          placeholder: '/page or https://example.com'
        },
        variant: {
          type: 'select',
          label: 'Button Style',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Outline', value: 'outline' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Ghost', value: 'ghost' },
            { label: 'Destructive', value: 'destructive' },
          ],
        },
        size: {
          type: 'select',
          label: 'Button Size',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Default', value: 'default' },
            { label: 'Large', value: 'lg' },
          ],
        },
        fullWidth: {
          type: 'checkbox',
          label: 'Full Width',
        },
      },
      defaultProps: {
        text: 'Click me',
        url: '#',
        variant: 'default',
        size: 'default',
        fullWidth: false,
      },
      render: (props: any) => <ButtonBlock {...props} />,
    },
    // Parish-Specific Components
    HeroSection: {
      fields: {
        title: { type: 'text', label: 'Title' },
        subtitle: { type: 'text', label: 'Subtitle' },
        imageUrl: { 
          type: 'text', 
          label: 'Background Image URL',
          placeholder: 'https://example.com/hero-image.jpg'
        },
      },
      defaultProps: {
        title: 'Welcome to Our Parish',
        subtitle: 'Join us in worship and fellowship',
        imageUrl: '',
      },
      render: (props: any) => <HeroSection {...props} />,
    },
    SchedulePreview: {
      fields: {
        title: { type: 'text', label: 'Title' },
        showFullSchedule: { type: 'checkbox', label: 'Show Full Schedule Link' },
      },
      defaultProps: {
        title: 'Service Schedule',
        showFullSchedule: true,
      },
      render: (props: any) => <SchedulePreview {...props} />,
    },
    DonationPanel: {
      fields: {
        title: { type: 'text', label: 'Title' },
        description: { type: 'textarea', label: 'Description' },
      },
      defaultProps: {
        title: 'Support Our Parish',
        description: 'Your generosity helps us serve our community',
      },
      render: (props: any) => <DonationPanel {...props} />,
    },
    NewsList: {
      fields: {
        title: { type: 'text', label: 'Title' },
        limit: { type: 'number', label: 'Number of Items' },
      },
      defaultProps: {
        title: 'Recent Announcements',
        limit: 3,
      },
      render: (props: any) => <NewsList {...props} />,
    },
    SermonCardGrid: {
      fields: {
        title: { type: 'text', label: 'Title' },
        limit: { type: 'number', label: 'Number of Sermons' },
      },
      defaultProps: {
        title: 'Recent Sermons',
        limit: 3,
      },
      render: (props: any) => <SermonCardGrid {...props} />,
    },
    GalleryGrid: {
      fields: {
        title: { type: 'text', label: 'Title' },
        imageUrls: { 
          type: 'array', 
          label: 'Images', 
          arrayFields: { 
            url: { 
              type: 'text', 
              label: 'Image URL',
              placeholder: 'https://example.com/image.jpg'
            } 
          } 
        },
      },
      defaultProps: {
        title: 'Parish Gallery',
        imageUrls: [],
      },
      render: (props: any) => <GalleryGrid {...props} />,
    },
    FeastHighlight: {
      fields: {
        feastName: { type: 'text', label: 'Feast Name' },
        date: { type: 'text', label: 'Date' },
        description: { type: 'textarea', label: 'Description' },
      },
      defaultProps: {
        feastName: 'Great Feast',
        date: new Date().toLocaleDateString(),
        description: 'Join us in celebration',
      },
      render: (props: any) => <FeastHighlight {...props} />,
    },
  },
}

