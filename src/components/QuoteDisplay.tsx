import React, { useState, useEffect } from 'react'

interface Quote {
  text: string
  author: string
}

const quotes: Quote[] = [
  { text: "成功不是终点，失败也不是末日：这是勇气的起点。", author: "温斯顿·丘吉尔" },
  { text: "相信自己，你能做到！", author: "佚名" },
  { text: "每一次努力都是在为未来的成功铺路。", author: "佚名" },
  { text: "坚持就是胜利，考研路上不放弃！", author: "佚名" },
  { text: "今天的你比昨天更接近梦想。", author: "佚名" },
  { text: "困难像弹簧，你弱它就强。", author: "佚名" },
  { text: "考研是一场持久战，坚持到最后的人才能笑到最后。", author: "佚名" },
  { text: "学习没有捷径，只有脚踏实地的努力。", author: "佚名" },
  { text: "每一个清晨都是新的开始，每一次复习都是进步的机会。", author: "佚名" },
  { text: "成功属于那些永不放弃的人。", author: "佚名" }
]

const QuoteDisplay: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote>(quotes[0])

  useEffect(() => {
    const changeQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length)
      setCurrentQuote(quotes[randomIndex])
    }

    // 每5分钟更新一次语录
    const interval = setInterval(changeQuote, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="quote-container">
      <p className="quote-text">"{currentQuote.text}"</p>
      <p className="quote-author">— {currentQuote.author}</p>
    </div>
  )
}

export default QuoteDisplay