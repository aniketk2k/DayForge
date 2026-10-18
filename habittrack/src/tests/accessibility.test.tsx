// @vitest-environment jsdom

import { render } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { describe, expect, it } from 'vitest'
import axeCore from 'axe-core'
import { LoginPage } from '../pages/LoginPage'

describe('accessibility smoke tests', () => {
  it('has no automated axe violations on the login page', async () => {
    const { container } = render(<LoginPage onLogin={() => undefined} />)
    const results = await axeCore.run(container)
    expect(results.violations).toEqual([])
  })
})