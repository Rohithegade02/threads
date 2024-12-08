import { memo } from 'react'
import ContentLoader, { Rect } from 'react-content-loader/native'

interface LoaderProps {
  widthStyle?: boolean
  heightStyle: number
  activityPage?: boolean
}

const Loader = ({ widthStyle, heightStyle, activityPage }: LoaderProps) => (
  <ContentLoader
    height={heightStyle!}
    width={undefined}
    speed={1}
    backgroundColor={'#2A2825'}
    foregroundColor={'#1E1C1A'}
    viewBox={activityPage ? '10 10 100 30' : '0 10 100 35'}
    style={{ marginHorizontal: widthStyle ? 5 : 0, borderRadius: 0 }}
  >
    {/* Only SVG shapes */}
    <Rect x='0' y='0' rx='5' ry='5' width='100%' height='280' />
  </ContentLoader>
)

export default memo(Loader)
