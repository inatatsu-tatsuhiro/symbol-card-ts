import type { VercelRequest, VercelResponse } from '@vercel/node'
import satori from 'satori'
import sharp from 'sharp'
import fs from 'fs'
import React from 'react'
import path from 'path'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const fontPath = path.join(process.cwd(), 'fonts', 'Roboto.ttf')
  const roboto = fs.readFileSync(fontPath)
  const width = 800
  const height = 256

  const option = {
    width,
    height,
    fonts: [
      {
        name: 'Roboto',
        data: roboto
      }
    ]
  }

  const s = {
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background:
        'linear-gradient(136deg, #2A74E2 13.85%, #2AA0E2 85.74%), linear-gradient(0deg, #2A74E2 0%, #2A74E2 100%)'
    },
    content: {
      width: `${width - 40}px`,
      height: `${height - 40}px`,
      padding: '32px',
      display: 'flex',

      background: 'white',
      borderRadius: '32px'
    },
    mainTitle: {
      fontSize: '32px',
      marginBottom: '16px'
    },
    address: {
      fontSize: '20px',
      marginBottom: '40px'
    },
    mosaic: {
      display: 'flex',
      marginBottom: '8px'
    },
    mosaic_label: {
      fontSize: '32px',
      marginRight: '16px'
    },
    mosaic_id: {
      fontSize: '32px'
    },
    no: {
      fontSize: '16px'
    }
  }

  const address = 'NAW7L44MVKCVBM6IGEBXLF2K7JYKEP6R5XMCEZA'
  const mosaicId = '4EB65C4005959604'
  const no = 'No. 1'

  const body = (
    <div style={s.root}>
      <div
        style={{
          flexDirection: 'column',
          ...{ ...s.content }
        }}>
        <div style={s.mainTitle}>Symbol Address</div>
        <div style={s.address}>{address}</div>
        <div style={s.mosaic}>
          <div style={s.mosaic_label}>ID</div>
          <div style={s.mosaic_id}>{mosaicId}</div>
        </div>
        <div style={s.no}>{no}</div>
      </div>
    </div>
  )

  const svg = await satori(body, option)

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer()
  res.setHeader('Content-Type', 'image/png')
  res.end(pngBuffer)
}
