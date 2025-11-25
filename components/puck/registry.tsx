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

export const config: Config = {
  components: {
    HeroSection: {
      fields: {
        title: { type: 'text', label: 'Title' },
        subtitle: { type: 'text', label: 'Subtitle' },
        imageUrl: { type: 'text', label: 'Image URL' },
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
        description: { type: 'text', label: 'Description' },
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
        imageUrls: { type: 'array', label: 'Images', arrayFields: { url: { type: 'text' } } },
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

