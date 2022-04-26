import fetch from 'node-fetch'
import type { NextApiRequest, NextApiResponse } from 'next'

const endpoint = `https://api.github.com/search/repositories`;

export default async (request:NextApiRequest, response:NextApiResponse) => {
  let url = endpoint

  if (typeof request.query.keyword !== undefined) {
    url = `${url}?q=${request.query.keyword}+in:name&per_page=${request.query.perPage}&page=${request.query.page}&sort=stars&order=desc`
    url = encodeURI(url)
    const apiResponce = await fetch(url)
    return response.json(apiResponce.body)
  }
  response.json([])
}