import type { VercelRequest, VercelResponse } from '@vercel/node'
import satori from 'satori'
import sharp from 'sharp'
import fs from 'fs'
import React from 'react'
import path from 'path'
import {
  Address,
  RepositoryFactoryHttp,
  TransactionGroup,
  TransactionSearchCriteria,
  TransactionType,
  TransferTransaction
} from 'symbol-sdk'

const publicKey =
  '9703DAE047A9162CD768130F85DEACA8A50B984BB64BCDE7DB9B781825953BA0'
const nodeUrl = 'https://sym-test-03.opening-line.jp:3001'
const repoFac = new RepositoryFactoryHttp(nodeUrl)
const txRepo = repoFac.createTransactionRepository()

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const fontPath = path.join(process.cwd(), 'api', 'fonts', 'Roboto.ttf')
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

  const address = req.query.address as string
  const mosaicId = req.query.ticketId as string

  const criteria: TransactionSearchCriteria = {
    group: TransactionGroup.Confirmed,
    signerPublicKey: publicKey,
    recipientAddress: Address.createFromRawAddress(address),
    embedded: true,
    type: [TransactionType.TRANSFER]
  }
  const data = await txRepo.search(criteria).toPromise()

  const tx = data?.data[0] as TransferTransaction
  console.log(tx)
  const no = tx.message.payload

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
  res.setHeader('Cache-Control', 'max-age=30')

  res.end(pngBuffer)
}
