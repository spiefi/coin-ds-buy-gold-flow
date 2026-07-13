import React from 'react'
import {
  Avatar,
  Badge,
  Button,
  Carousel,
  ProductMerchandisingCard,
} from 'jfs-components'
import cashbackImage from '../../assets/health-report-cashback.png'
import ackoImage from '../../assets/health-report-acko.png'
import jioLogo from '../../assets/jio-logo.png'

const CASHBACK_BADGE_MODES = {
  'Color Mode': 'Light',
  'Page type': 'SubPage',
  'Avatar Size': 'XS',
  Context4: 'Badge/glass',
} as const

function AckoCard({ index }: { index: number }) {
  return (
    <ProductMerchandisingCard
      imageSource={ackoImage}
      avatarSource={jioLogo}
      title="Acko Insurance"
      subtitle="Based on your Protection report"
      specialBadge={
        <Badge
          type="glass"
          label="₹100–₹5000 cashback"
          modes={CASHBACK_BADGE_MODES}
          leading={
            <Avatar
              style="Image"
              imageSource={cashbackImage}
              modes={CASHBACK_BADGE_MODES}
            />
          }
        />
      }
      cta={
        <Button
          label="Explore"
          modes={{
            'Button / Size': 'S',
            AppearanceBrand: 'Secondary',
            Emphasis: 'Medium',
          }}
        />
      }
      height={223}
      accessibilityLabel={`Acko Insurance recommendation ${index + 1}`}
      disableTruncation
    />
  )
}

export function HealthReportMerchandisingCarousel() {
  return (
    <Carousel
      type="Default"
      showPagination
      loop={false}
      itemWidth={296}
      gap={8}
      paddingHorizontal={0}
      paddingVertical={8}
      style={{ width: '100%', minHeight: 253, maxHeight: 280 }}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <AckoCard key={`acko-${index}`} index={index} />
      ))}
    </Carousel>
  )
}

export default HealthReportMerchandisingCarousel
