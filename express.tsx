import satori from 'satori'
import sharp from 'sharp'
import fs from 'fs'
import React from 'react'
import express from 'express'
import {
  Address,
  AggregateTransaction,
  MosaicId,
  NetworkType,
  PublicAccount,
  RepositoryFactoryHttp,
  TransactionGroup,
  TransactionSearchCriteria,
  TransactionType,
  TransferTransaction
} from 'symbol-sdk'

const roboto = fs.readFileSync('./fonts/Roboto.ttf')

const app = express()

app.get('/', (req, res) => {
  res.send('hello')
})

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

app.get('/image', async (req, res) => {
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

  const master = PublicAccount.createFromPublicKey(
    '9703DAE047A9162CD768130F85DEACA8A50B984BB64BCDE7DB9B781825953BA0',
    NetworkType.TEST_NET
  )

  const nodeUrl = 'https://sym-test-03.opening-line.jp:3001'
  const repoFac = new RepositoryFactoryHttp(nodeUrl)
  const txRepo = repoFac.createTransactionRepository()

  const address = 'TCKAT7MEF3MOMXR52OOOYLTGE6JCX6KJFH4375A'
  const mosaicId = '421A6EC7B6865BFB'

  const criteria: TransactionSearchCriteria = {
    group: TransactionGroup.Confirmed,
    signerPublicKey: master.publicKey,
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
  res.type('png')
  res.send(pngBuffer)
})

app.listen({ port: 3000 }, () => {
  console.log(`Server ready at http://localhost:3000`)
})
console.log('starts')

export default app
