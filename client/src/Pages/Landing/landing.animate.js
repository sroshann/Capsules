import gsap from "gsap"

export const animateImages = ( syringeRef, bandAidRef, capsuleRef, bottleRef, logoTextRef ) => {

    const syringeTimeLine = gsap.timeline()
    const bandAidTimeLine = gsap.timeline()
    const capsuleTimeLine = gsap.timeline()
    const bottleTimeLine = gsap.timeline()

    // Syringe
    syringeTimeLine.fromTo( 
        
        syringeRef.current,
        { opacity : 0, x : 200, y : -100 },
        {

            opacity : 1,
            x : 0,
            y : 0,
            ease : 'power2.inOut',
            duration : 0.8

        }

    )
    syringeTimeLine.to(  

        syringeRef.current,
        { y : -7, x : 7, duration : 0.8, ease : 'power2.inOut', repeat : -1, yoyo : true }

    )

    // Band-Aid
    bandAidTimeLine.fromTo( 
        
        bandAidRef.current,
        { opacity : 0, x : -200, y : -100 },
        {

            opacity : 1,
            x : 0,
            y : 0,
            ease : 'power2.inOut',
            duration : 0.8

        }

    )
    bandAidTimeLine.to(  

        bandAidRef.current,
        { y : -7, duration : 0.8, ease : 'power2.inOut', repeat : -1, yoyo : true }

    )

    // Capsule
    capsuleTimeLine.fromTo( 
        
        capsuleRef.current,
        { opacity : 0, x : -200, y : 100 },
        {

            opacity : 1,
            x : 0,
            y : 0,
            ease : 'power2.inOut',
            duration : 0.8

        }

    )
    capsuleTimeLine.to(  

        capsuleRef.current,
        { x : 7, duration : 0.8, ease : 'power2.inOut', repeat : -1, yoyo : true }

    )

    // Bottle
    bottleTimeLine.fromTo( 
        
        bottleRef.current,
        { opacity : 0, x : 200, y : 100 },
        {

            opacity : 1,
            x : 0,
            y : 0,
            ease : 'power2.inOut',
            duration : 0.8

        }

    )
    bottleTimeLine.to(  

        bottleRef.current,
        { x : -7, y : -7, duration : 0.8, ease : 'power2.inOut', repeat : -1, yoyo : true }

    )

    // Logo text
    gsap.fromTo( 
        
        logoTextRef.current,
        { opacity : 0 },
        {

            opacity : 1,
            ease : 'power2.inOut',
            duration : 0.8

        }

    )

}

export const animateDesktopBento = () => {

    const timeLine = gsap.timeline({ 
        
        defaults : { duration : 0.6, ease : 'power2.inOut' },
        scrollTrigger : { trigger : '#bento-grid', toggleActions : 'play reverse play reverse'}
    
    })

    timeLine.add([

        gsap.fromTo( '.desktop-bento-left', { opacity : 0, x : -50 }, { opacity : 1, x : 0 }),
        gsap.fromTo( '.desktop-bento-right', { opacity : 0, x : 50 }, { opacity : 1, x : 0 }),
        gsap.fromTo( '.desktop-bento-upper', { opacity : 0, y : -50 }, { opacity : 1, y : 0 }),
        gsap.fromTo( '.desktop-bento-lower', { opacity : 0, y : 50 }, { opacity : 1, y : 0 }),

    ])

}

export const animateMobileBento = () => {

    const timeLine = gsap.timeline({ 
        
        defaults : { duration : 0.6, ease : 'power2.inOut' },
        scrollTrigger : { trigger : '#mobile-bento-grid', toggleActions : 'play reverse play reverse' }
    
    })
    timeLine.add([

        gsap.fromTo( '.mobile-bento-upper', { opacity : 0, y : -50 }, { opacity : 1, y : 0 }),
        gsap.fromTo( '.mobile-bento-lower', { opacity : 0, y : 50 }, { opacity : 1, y : 0 }),
        gsap.fromTo( '.mobile-bento-right', { opacity : 0, x : 50 }, { opacity : 1, x : 0 }),
        gsap.fromTo( '.mobile-bento-left', { opacity : 0, x : -50 }, { opacity : 1, x : 0 })

    ])

}

export const animateSecurity = ( securityRef ) => 
    gsap.fromTo( 
        
        securityRef.current, 
        { opacity : 0 }, 
        { 
            
            scrollTrigger : { trigger : securityRef.current, toggleActions : 'play none none none' },
            opacity : 1, 
            ease : 'power2.inOut', 
            duration : 0.8 
        
        }
    
    )