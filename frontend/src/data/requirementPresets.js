export const featureOptions = [
  'Lead capture',
  'Services overview',
  'Pricing',
  'Testimonials',
  'Contact form',
  'FAQ',
]

export const blankRequirements = {
  businessType: '',
  companyName: '',
  colorTheme: 'Blue',
  targetAudience: '',
  requiredFeatures: ['Lead capture', 'Services overview', 'Contact form'],
}

export const requirementPresets = [
  {
    id: 'automation-agency',
    label: 'Automation agency',
    requirements: {
      businessType: 'AI automation agency',
      companyName: 'NovaFlow',
      colorTheme: 'Blue',
      targetAudience: 'small business owners',
      requiredFeatures: [
        'Lead capture',
        'Services overview',
        'Testimonials',
        'Contact form',
      ],
    },
  },
  {
    id: 'design-studio',
    label: 'Design studio',
    requirements: {
      businessType: 'Brand and product design studio',
      companyName: 'PixelCraft',
      colorTheme: 'Purple',
      targetAudience: 'startup founders',
      requiredFeatures: [
        'Services overview',
        'Pricing',
        'Testimonials',
        'Contact form',
      ],
    },
  },
  {
    id: 'wellness-coach',
    label: 'Wellness coach',
    requirements: {
      businessType: 'Health and wellness coaching',
      companyName: 'ThrivePath',
      colorTheme: 'Green',
      targetAudience: 'busy professionals',
      requiredFeatures: ['Lead capture', 'Services overview', 'FAQ', 'Contact form'],
    },
  },
]
