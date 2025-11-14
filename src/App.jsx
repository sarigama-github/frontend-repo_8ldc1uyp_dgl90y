import React, { useMemo, useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import Spline from '@splinetool/react-spline'
import { ShoppingCart, Menu, Filter, SlidersHorizontal, MessageCircle, ChevronRight, ChevronLeft, X, Sparkles, Plus, Minus, Search } from 'lucide-react'

const accent = 'from-fuchsia-500 via-purple-500 to-sky-500'

function useParallaxTilt(strength = 10) {
  const ref = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      rx.set(-py * strength)
      ry.set(px * strength)
    }
    const onLeave = () => {
      rx.set(0); ry.set(0)
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave) }
  }, [rx, ry, strength])
  return { ref, rx, ry }
}

function Header({ cartCount, pulsing }) {
  const { ref, rx, ry } = useParallaxTilt(6)
  return (
    <motion.header
      className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <motion.div ref={ref} style={{ rotateX: rx, rotateY: ry }} className="flex items-center gap-3 select-none">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-sky-500 shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center justify-center">
            <Sparkles className="text-white" size={18} />
          </div>
          <span className="text-white/90 font-semibold tracking-wide">Flux Accessories</span>
        </motion.div>
        <nav className="hidden md:flex items-center gap-8">
          {['Shop','New','Collections','Support'].map((item) => (
            <LiquidLink key={item}>{item}</LiquidLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button className="md:hidden text-white/80 hover:text-white"><Menu /></button>
          <button className={`relative group text-white/90`}>
            <ShoppingCart className={`${pulsing ? 'cart-pulse' : ''}`} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-fuchsia-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow-neon">{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </motion.header>
  )
}

function LiquidLink({ children }) {
  return (
    <motion.a
      href="#"
      className="relative text-white/80 hover:text-white font-medium"
      whileHover={{ scaleY: 1.04, scaleX: 1.04 }}
      transition={{ type: 'spring', stiffness: 350, damping: 18 }}
    >
      <span className="inline-block transition-all">{children}</span>
      <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-gradient-to-r from-fuchsia-500 to-sky-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </motion.a>
  )
}

function Hero() {
  const { scrollY } = useScroll()
  const rotate = useTransform(scrollY, [0, 600], [0, 30])
  const y = useTransform(scrollY, [0, 600], [0, -80])

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(139,92,246,0.25),transparent),radial-gradient(1200px_600px_at_80%_-10%,rgba(14,165,233,0.25),transparent)]" />
      <div className="absolute inset-0 pointer-events-none noise-light opacity-30" />

      <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div>
          <motion.h1
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white"
          >
            {['Future-ready','tech accessories','that feel alive'].map((t, i) => (
              <motion.span
                key={i}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="block"
              >{t}</motion.span>
            ))}
          </motion.h1>
          <p className="mt-5 text-white/70 max-w-xl">
            Magnetic interactions, soft neon glows, and buttery animations. Meet the shop where every pixel plays.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <GlossyCTA>Shop now</GlossyCTA>
            <button className="text-white/70 hover:text-white transition-colors">Explore collections →</button>
          </div>
        </div>
        <motion.div style={{ rotate, y }} className="relative h-[420px] lg:h-[520px] rounded-3xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-xl">
          <Spline scene="https://prod.spline.design/wwTRdG1D9CkNs368/scene.splinecode" style={{ width: '100%', height: '100%' }} />
          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/5"
            animate={{ opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </section>
  )
}

function GlossyCTA({ children, onClick }) {
  return (
    <button onClick={onClick}
      className={`relative overflow-hidden rounded-xl px-6 py-3 font-semibold text-white bg-gradient-to-r ${accent} shadow-neon focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50`}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 sheen" />
    </button>
  )
}

const demoProducts = new Array(10).fill(0).map((_, i) => ({
  id: i + 1,
  name: ['Nebula Headset','Ion Cable','Flux Charger','Pulse Keyboard','Aero Mouse'][i % 5] + ' ' + (i+1),
  price: [199, 29, 59, 149, 89][i % 5],
  color: ['violet','sky','fuchsia','emerald','amber'][i % 5],
  specs: ['Bluetooth 5.3 • ANC • 30h','USB-C 2m • Kevlar','65W GaN • Dual Port','Hall-effect • RGB','58g • 26k DPI'][i % 5],
  img: `https://images.unsplash.com/photo-1518442566798-7db59b89f312?q=80&w=800&auto=format&fit=crop`
}))

function ProductCarousel({ onAdd }) {
  const [hover, setHover] = useState(false)
  const speed = hover ? 22 : 12
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-2xl font-bold">Trending now</h2>
          <div className="hidden md:flex items-center gap-2 text-white/60">
            <SlidersHorizontal size={18} /> Interactive infinity slider
          </div>
        </div>
        <div className="relative group" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          <Marquee speed={speed}>
            {demoProducts.concat(demoProducts).map((p) => (
              <ProductCard key={`a-${p.id}-${Math.random()}`} product={p} onAdd={onAdd} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}

function Marquee({ children, speed = 12 }) {
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-6 will-change-transform"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 60 / (speed / 10) }}
        style={{ width: '200%' }}
      >
        <div className="flex gap-6 w-1/2">{children}</div>
        <div className="flex gap-6 w-1/2">{children}</div>
      </motion.div>
    </div>
  )
}

function ProductCard({ product, onAdd }) {
  const [flipped, setFlipped] = useState(false)
  const [adding, setAdding] = useState(false)
  const handleAdd = () => {
    setAdding(true)
    onAdd?.(product)
    setTimeout(() => setAdding(false), 500)
  }
  return (
    <motion.div
      className="group perspective-1000 w-[260px]"
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div className="relative h-[340px] [transform-style:preserve-3d] duration-500" style={{ transform: `rotateY(${flipped ? 180 : 0}deg)` }}>
        <div className="absolute inset-0 rounded-2xl p-4 bg-white/5 border border-white/10 backdrop-blur-xl [backface-visibility:hidden]">
          <div className="h-36 rounded-xl bg-gradient-to-tr from-white/10 to-white/5 overflow-hidden relative">
            <img src={product.img} alt="" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 pointer-events-none noise-light opacity-30" />
          </div>
          <div className="mt-4">
            <h3 className="text-white font-semibold">{product.name}</h3>
            <p className="text-white/60 text-sm">${product.price}</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">{product.color}</span>
            <BubbleButton onClick={handleAdd} active={adding}>
              <Plus size={16} /> Add
            </BubbleButton>
          </div>
        </div>
        <div className="absolute inset-0 rounded-2xl p-4 bg-black/60 border border-white/10 backdrop-blur-xl rotate-y-180 [backface-visibility:hidden]">
          <h4 className="text-white/80 font-medium mb-2">Specs</h4>
          <ul className="text-white/70 text-sm space-y-2 list-disc ml-4">
            {product.specs.split('•').map((s, i) => (<li key={i}>{s.trim()}</li>))}
          </ul>
          <p className="text-xs text-white/50 mt-4">Hover to flip back</p>
        </div>
      </div>
    </motion.div>
  )
}

function BubbleButton({ children, onClick, active }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-gradient-to-r from-fuchsia-600 to-sky-500 text-white shadow-neon"
      whileTap={{ scale: 1.1 }}
      animate={active ? { scale: [1, 1.12, 1] } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 12 }}
    >
      {children}
    </motion.button>
  )
}

function Filters({ onChange }) {
  const [open, setOpen] = useState(true)
  const [state, setState] = useState({ wireless: false, fastcharge: false, rgb: true })

  useEffect(() => { onChange?.(state) }, [state])

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between text-white">
        <span className="font-semibold">Smart Filters</span>
        <Filter className={`${open ? 'rotate-0' : 'rotate-180'} transition-transform`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 space-y-3">
            {[
              { key: 'wireless', label: 'Wireless' },
              { key: 'fastcharge', label: 'Fast charge' },
              { key: 'rgb', label: 'RGB' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-white/80">{label}</span>
                <NeonSwitch checked={state[key]} onChange={(v) => setState(s => ({ ...s, [key]: v }))} />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NeonSwitch({ checked, onChange }) {
  return (
    <button onClick={() => onChange?.(!checked)} className={`relative h-7 w-12 rounded-full transition-colors ${checked ? 'bg-fuchsia-600/60' : 'bg-white/10'} border border-white/10`}> 
      <motion.span layout className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white ${checked ? 'shadow-neon' : ''}`} animate={{ x: checked ? 22 : 0, boxShadow: checked ? '0 0 30px rgba(217,70,239,0.6)' : '0 0 0 rgba(0,0,0,0)' }} transition={{ type: 'spring', stiffness: 400, damping: 28 }} />
    </button>
  )
}

function ProductGrid({ onAdd }) {
  const [filters, setFilters] = useState({})
  const [items, setItems] = useState(demoProducts)

  useEffect(() => {
    // simulate filter change animation
    const outThenIn = async () => {
      setItems([])
      setTimeout(() => setItems(demoProducts.filter((_, i) => Math.random() > 0.2)), 250)
    }
    outThenIn()
  }, [filters])

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[280px,1fr] gap-6">
        <div className="lg:sticky lg:top-24 self-start">
          <Filters onChange={setFilters} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-white/70"><Search size={18}/> {items.length} results</div>
          </div>
          <motion.div layout className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {items.map((p) => (
                <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
                  <ProductCard product={p} onAdd={onAdd} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function FloatingChat() {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed right-4 bottom-20 md:bottom-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10 }} className="mb-3 w-[280px] sm:w-[340px] rounded-2xl p-4 bg-white/10 border border-white/10 backdrop-blur-xl text-white origin-bottom-right">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Flux Assistant</div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white"><X size={16}/></button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              <ChatBubble who="bot" text="Hey! Need help picking the perfect accessory?" />
              <ChatBubble who="user" text="Show me wireless chargers under $60" />
              <ChatBubble who="bot" text="Got it. Applying filters and showing best matches." />
            </div>
            <div className="mt-3 flex gap-2">
              <input className="flex-1 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40" placeholder="Ask anything..."/>
              <button className="rounded-xl px-3 bg-gradient-to-r from-fuchsia-600 to-sky-500 text-white">Send</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen((v)=>!v)}
        className="relative h-14 w-14 rounded-full bg-gradient-to-br from-fuchsia-600 to-sky-600 text-white shadow-neon flex items-center justify-center"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MessageCircle />
      </motion.button>
    </div>
  )
}

function ChatBubble({ who = 'bot', text }) {
  const isBot = who === 'bot'
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 250, damping: 20 }} className={`max-w-[85%] ${isBot ? '' : 'ml-auto'}`}>
      <div className={`px-3 py-2 rounded-xl text-sm ${isBot ? 'bg-white/10' : 'bg-gradient-to-r from-fuchsia-600/80 to-sky-500/80'} border border-white/10`}>{text}</div>
    </motion.div>
  )
}

function Checkout() {
  const [step, setStep] = useState(1)
  const [confetti, setConfetti] = useState(0)
  const next = () => setStep((s) => Math.min(3, s + 1))
  const prev = () => setStep((s) => Math.max(1, s - 1))
  const confirm = () => { setConfetti(c => c + 1); setStep(1) }
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h3 className="text-white text-2xl font-bold mb-4">Checkout</h3>
        <div className="rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-6">
            <motion.div className={`h-full bg-gradient-to-r ${accent}`} initial={false} animate={{ width: `${(step-1)/2*100}%` }} />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid sm:grid-cols-2 gap-4">
                <Input label="Full name" />
                <Input label="Email" />
                <Input label="Address" className="sm:col-span-2" />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid sm:grid-cols-2 gap-4">
                <Input label="Card number" />
                <Input label="Name on card" />
                <Input label="Expiry" />
                <Input label="CVC" />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-white/80">
                <p>Review your order and confirm purchase.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex justify-between">
            <button onClick={prev} className="px-4 py-2 rounded-xl text-white/80 hover:text-white">Back</button>
            {step < 3 ? (
              <GlossyCTA onClick={next}>Next</GlossyCTA>
            ) : (
              <GlossyCTA onClick={confirm}>Confirm</GlossyCTA>
            )}
          </div>
        </div>
      </div>
      <ConfettiBurst key={confetti} run={confetti} />
    </section>
  )
}

function Input({ label, className='' }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-white/70 text-sm">{label}</span>
      <input className="mt-1 w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 glow-focus" placeholder={label} />
    </label>
  )
}

function ConfettiBurst({ run }) {
  const [pieces, setPieces] = useState([])
  useEffect(() => {
    const colors = ['#a78bfa','#22d3ee','#f472b6','#34d399','#fbbf24']
    const arr = Array.from({ length: 40 }, (_, i) => ({ id: i, x: Math.random()*100, y: -10, r: Math.random()*360, c: colors[i%colors.length] }))
    setPieces(arr)
    const t = setTimeout(()=> setPieces([]), 1800)
    return () => clearTimeout(t)
  }, [run])
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map(p => (
        <motion.span key={p.id} className="absolute h-2 w-2 rounded-[2px]" style={{ left: `${p.x}%`, top: `-10px`, background: p.c }} animate={{ y: ['-10px','110vh'], x: [0, (Math.random()*2-1)*200], rotate: [0, 720] }} transition={{ duration: 1.6, ease: 'easeOut' }} />
      ))}
    </div>
  )
}

function BottomNav() {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed inset-x-0 bottom-0 md:hidden z-50">
      <div className="mx-auto max-w-md mb-3 px-4">
        <div className="rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl p-2 flex items-center justify-around text-white/70">
          <button>Home</button>
          <button>Shop</button>
          <button>Search</button>
          <button>Account</button>
          <div className="relative">
            <motion.button onClick={() => setOpen(v=>!v)} className="h-12 w-12 rounded-full bg-gradient-to-br from-fuchsia-600 to-sky-600 text-white shadow-neon flex items-center justify-center">
              <Plus />
            </motion.button>
            <AnimatePresence>
              {open && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute -top-28 right-0 w-44 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl p-3 pointer-events-auto">
                  <div className="text-white/80">Quick actions</div>
                  <div className="mt-2 flex flex-col gap-2">
                    <button className="text-left text-white/70 hover:text-white">Open filters</button>
                    <button className="text-left text-white/70 hover:text-white">View cart</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [cart, setCart] = useState([])
  const [pulse, setPulse] = useState(false)
  const addToCart = (p) => {
    setCart((c) => [...c, p])
    setPulse(true)
    setTimeout(() => setPulse(false), 1200)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0a0a12] to-[#06060a] text-white selection:bg-fuchsia-500/40">
      <Header cartCount={cart.length} pulsing={pulse} />

      <Hero />
      <ProductCarousel onAdd={addToCart} />
      <ProductGrid onAdd={addToCart} />
      <Checkout />

      <FloatingChat />
      <BottomNav />
    </div>
  )
}
