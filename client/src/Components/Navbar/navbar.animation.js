import gsap from "gsap"

export const desktopNav = (navRef) => {

    gsap.fromTo(navRef.current,

        { opacity: 0 },
        { opacity: 1, duration: 0.8, }

    )

}

export const menuBtn = (btnRef) => gsap.from(btnRef.current, { opacity: 0, duration: 0.8 })

// Open menu
export const openMobileNav = (divRef) => {

    const tl = gsap.timeline()

    tl.fromTo(divRef.current,

        { height: '0dvh', opacity: 0 },
        {
            height: '100dvh',
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
        }

    )

    tl.fromTo(divRef.current.querySelectorAll('#lower p'),

        { opacity: 0, y: 0 },
        {
            opacity: 1,
            y: 20,
            duration: 0.3,
            ease: 'power2.inOut',
            stagger: 0.1
        },
        '-=0.2' // start slightly before the first animation ends (optional)

    )

}
// Close menu
export const closeMobileNav = (divRef, setOpenMenu = null) => {

    const tl = gsap.timeline({ onComplete: () => setOpenMenu(prev => !prev) });

    tl.to('#lower p', {

        opacity: 0,
        y: -20,
        stagger: 0.1,
        ease: 'power2.inOut',
        duration: 0.4

    })

    tl.to(divRef.current, {

        height: '0dvh',
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut'

    }, '-=0.2')

}
