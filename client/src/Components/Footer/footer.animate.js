import gsap from "gsap";

export const animateFooter = ( footerRef ) => {

    const timeLine = gsap.timeline({ 
        
        scrollTrigger : { 
            
            trigger : footerRef.current,
            toggleActions: "play none none none"
        
        } 
    
    })

    timeLine.fromTo( footerRef.current, { opacity : 0 }, { opacity : 1, duration : 0.4, ease : 'power2.inOut' })
    timeLine.fromTo( '#upper-footer-section', { opacity : 0, y : -5 }, { opacity : 1, y : 0 }, '-=0.1' )
    timeLine.fromTo( '#footer-logo', { opacity : 0, y : -5 }, { opacity : 1, y : 0 }, '-=0.2' )
    timeLine.fromTo( '#lower-footer-section', { opacity : 0, y : -5 }, { opacity : 1, y : 0 }, '-=0.3' )

}