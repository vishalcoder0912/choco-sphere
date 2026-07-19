#!/bin/bash
npm install
npx prisma generate
npx prisma db push --skip-generate
npm start