const CDN_URL = 'https://unpkg.com/html5-qrcode@2.3.8/minified/html5-qrcode.min.js'

export type Html5QrcodeInstance = {
  start(
    cameraConfig: { facingMode: 'environment' | 'user' } | { deviceId: string },
    config: { fps?: number; qrbox?: { width: number; height: number } },
    onSuccess: (decodedText: string) => void,
    onError?: (err: unknown) => void
  ): Promise<void>
  stop(): Promise<void>
  clear(): Promise<void>
}

export type Html5QrcodeConstructor = new (elementId: string) => Html5QrcodeInstance

declare global {
  interface Window {
    Html5Qrcode?: Html5QrcodeConstructor
  }
}

let loadPromise: Promise<Html5QrcodeConstructor> | null = null

export async function loadHtml5Qrcode(): Promise<Html5QrcodeConstructor> {
  if (typeof window === 'undefined') {
    throw new Error('Html5Qrcode can only be loaded in the browser')
  }
  if (window.Html5Qrcode) {
    return window.Html5Qrcode
  }
  if (!loadPromise) {
    loadPromise = new Promise<Html5QrcodeConstructor>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-html5-qrcode]')
      if (existing) {
        existing.addEventListener('load', () => {
          if (window.Html5Qrcode) {
            resolve(window.Html5Qrcode)
          } else {
            reject(new Error('Html5Qrcode not available after script load'))
          }
        })
        existing.addEventListener('error', () => reject(new Error('Failed to load Html5Qrcode script')))
        return
      }

      const script = document.createElement('script')
      script.src = CDN_URL
      script.async = true
      script.defer = true
      script.dataset.html5Qrcode = 'true'
      script.addEventListener('load', () => {
        if (window.Html5Qrcode) {
          resolve(window.Html5Qrcode)
        } else {
          reject(new Error('Html5Qrcode not available after script load'))
        }
      })
      script.addEventListener('error', () => {
        reject(new Error('Failed to load Html5Qrcode script'))
      })
      document.head.appendChild(script)
    }).catch((err) => {
      loadPromise = null
      throw err
    })
  }
  return loadPromise
}
