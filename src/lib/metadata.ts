import ogs from 'open-graph-scraper'

export interface LinkMetadata {
  title: string
  description: string | null
  imageUrl: string | null
  siteName: string | null
}

export async function fetchLinkMetadata(url: string): Promise<LinkMetadata> {
  try {
    const { result } = await ogs({ url })
    
    // Get the best image available
    let imageUrl: string | null = null
    if (result.ogImage && result.ogImage.length > 0) {
      imageUrl = result.ogImage[0].url
    } else if (result.twitterImage && result.twitterImage.length > 0) {
      imageUrl = result.twitterImage[0].url
    }
    
    return {
      title: result.ogTitle || result.twitterTitle || result.dcTitle || 'Untitled',
      description: result.ogDescription || result.twitterDescription || result.dcDescription || null,
      imageUrl,
      siteName: result.ogSiteName || null,
    }
  } catch (error) {
    console.error('Error fetching metadata:', error)
    return {
      title: 'Untitled',
      description: null,
      imageUrl: null,
      siteName: null,
    }
  }
}



