import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import Link from 'next/link'
import { AnchorHTMLAttributes, DetailedHTMLProps, ImgHTMLAttributes } from 'react'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

// Default Image component with enhanced capabilities
const DefaultImage = (
  props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
) => {
  const src = typeof props.src === 'string' ? props.src : ''
  const width = typeof props.width === 'number' ? props.width : 800
  const height = typeof props.height === 'number' ? props.height : 600

  return (
    <Image
      src={src}
      alt={props.alt || ''}
      width={width}
      height={height}
      className="h-auto w-full rounded-lg shadow-lg"
    />
  )
}

// Default Link component for internal/external links
const DefaultLink = (
  props: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
) => {
  const { href, children, ...rest } = props

  // Check if it's an internal link
  if (href?.startsWith('/') || href?.startsWith('#')) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    )
  }

  // External links
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  )
}

// Default components for MDX rendering
const defaultComponents = {
  img: DefaultImage,
  a: DefaultLink,
}

interface MdxRendererProps {
  content: string
  className?: string
  components?: Record<string, React.ComponentType<unknown>>
}

export function MdxRenderer({
  content,
  className = '',
  components: customComponents = {},
}: MdxRendererProps) {
  if (!content) {
    return null
  }

  // Merge custom components with defaults, allowing overrides
  const mergedComponents = {
    ...defaultComponents,
    ...customComponents,
  }

  const mdxElement = (
    <MDXRemote
      source={content}
      components={mergedComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [
            // Add GitHub Flavored Markdown support
            remarkGfm,
          ],
          rehypePlugins: [
            // Add heading slugs for anchor links
            rehypeSlug,
            // Add autolink headings
            rehypeAutolinkHeadings,
          ],
        },
      }}
    />
  )

  // Only wrap in div if className is provided
  if (className) {
    return <div className={className}>{mdxElement}</div>
  }

  return mdxElement
}
