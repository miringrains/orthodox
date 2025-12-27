'use client'

import { TextBlock } from './components/TextBlock'
import { ImageBlock } from './components/ImageBlock'
import { ButtonBlock } from './components/ButtonBlock'
import { Heading } from './components/Heading'
import { HeroSection } from './components/HeroSection'
import { Navbar } from './components/Navbar'
import { Container } from './components/Container'
import { Section } from './components/Section'
import { TwoColumn } from './components/TwoColumn'
import { ThreeColumn } from './components/ThreeColumn'
import { Spacer } from './components/Spacer'
import { Divider } from './components/Divider'
import { SchedulePreview } from './components/SchedulePreview'
import { DonationPanel } from './components/DonationPanel'
import { NewsList } from './components/NewsList'
import { SermonCardGrid } from './components/SermonCardGrid'
import { GalleryGrid } from './components/GalleryGrid'
import { FeastHighlight } from './components/FeastHighlight'
import { ColumnCanvas } from './components/shared/ColumnCanvas'
// Orthodox-specific components
import { Triptych } from './components/Triptych'
import { FeastBanner } from './components/FeastBanner'
import { IconDisplay } from './components/IconDisplay'
import { CallToActionBar } from './components/CallToActionBar'
import { FloatingImageSection } from './components/FloatingImageSection'
import { ClippedImage } from './components/ClippedImage'
// New data-bound components
import { LiturgicalCalendar } from './components/LiturgicalCalendar'
import { ContactForm } from './components/ContactForm'
import { LocationMap } from './components/LocationMap'
import { LiveStreamEmbed } from './components/LiveStreamEmbed'
import { FileDownload } from './components/FileDownload'

// Export components for Craft.js resolver
export const craftComponents = {
  TextBlock,
  ImageBlock,
  ButtonBlock,
  Heading,
  HeroSection,
  Navbar,
  Container,
  Section,
  TwoColumn,
  ThreeColumn,
  Spacer,
  Divider,
  SchedulePreview,
  DonationPanel,
  NewsList,
  SermonCardGrid,
  GalleryGrid,
  FeastHighlight,
  ColumnCanvas,
  // Orthodox-specific components
  Triptych,
  FeastBanner,
  IconDisplay,
  CallToActionBar,
  // New visual components
  FloatingImageSection,
  ClippedImage,
  // New data-bound components
  LiturgicalCalendar,
  ContactForm,
  LocationMap,
  LiveStreamEmbed,
  FileDownload,
}
