import React, { useMemo, useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const {
    src,
    alt,
    style,
    className,
    width,
    height,
    ...rest
  } = props

  const fallbackStyle = useMemo<React.CSSProperties>(() => {
    const resolvedStyle: React.CSSProperties = {
      backgroundColor: 'var(--card)',
      color: 'var(--foreground)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      ...style,
    }

    if (width !== undefined) {
      resolvedStyle.width = typeof width === 'number' ? `${width}px` : width
    }

    if (height !== undefined) {
      resolvedStyle.height = typeof height === 'number' ? `${height}px` : height
    }

    return resolvedStyle
  }, [style, width, height])

  const handleError = () => {
    setDidError(true)
  }

  if (didError) {
    return (
      <div className={cn(className)} style={fallbackStyle}>
        <span className="sr-only">Error loading image</span>
        <img
          src={ERROR_IMG_SRC}
          alt=""
          aria-hidden="true"
          data-original-url={src}
          {...rest}
          style={{
            maxWidth: '60%',
            maxHeight: '60%',
          }}
        />
      </div>
    )
  }

  const fallbackStyle = useMemo<React.CSSProperties>(() => ({
    backgroundColor: 'var(--card)',
    color: 'var(--card-foreground)',
    display: 'inline-block',
    ...style,
  }), [style])

  return didError ? (
    <div className={`text-center align-middle ${className || ''}`} style={fallbackStyle}>
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  )
}
