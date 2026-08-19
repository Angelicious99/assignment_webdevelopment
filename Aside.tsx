import { Link } from 'react-router-dom'
import { useState, type FormEvent } from 'react'

export default function Aside() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <aside className="page-aside">
      <div className="aside-card">
        <h4>About Our Wines</h4>
        <p>Devon Valley Winery has been producing award-winning wines for over three decades. Our grapes are hand-picked from sustainable vineyards and crafted into wines of exceptional character and quality.</p>
      </div>
