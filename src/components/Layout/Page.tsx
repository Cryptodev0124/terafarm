import styled from 'styled-components'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { DEFAULT_META, getCustomMeta } from 'config/constants/meta'
import Container from './Container'

const StyledPage = styled(Container)`
  width: 100%;
  min-height: calc(100vh - 64px);
  padding-top: 16px;
  padding-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    padding-bottom: 32px;
  }
`

export const PageMeta: React.FC<React.PropsWithChildren> = () => {
  const { pathname } = useRouter()

  const pageMeta = getCustomMeta(pathname)

  if (!pageMeta) {
    return null
  }

  const { description, image } = { ...DEFAULT_META, ...pageMeta }

  return (
    <>
      <video
        autoPlay
        loop
        muted
        id="background-video"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: '50% 50%',
          position: 'fixed',
          margin: 'auto',
          width: '100%',
          height: '-webkit-fill-available',
          // right: '-100%',
          // bottom: '-100%',
          // top: '-100%',
          // left: '-100%',
          objectFit: 'cover',
          zIndex: '-100',
        }}
      >
        <source src="/images/background.mp4" type="video/mp4" />
      </video>
      <NextSeo
        title={pageMeta.title}
        description={description}
        openGraph={
          image
            ? {
                images: [{ url: image, alt: pageMeta?.title, type: 'image/jpeg' }],
              }
            : undefined
        }
      />
    </>
  )
}

const Page: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>> = ({ children, ...props }) => {
  return (
    <>
      <PageMeta />
      <StyledPage {...props}>{children}</StyledPage>
    </>
  )
}

export default Page
