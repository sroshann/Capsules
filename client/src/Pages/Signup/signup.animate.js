import gsap from "gsap"

export const animateSignup = (labelRef, formRef) => {

    gsap.fromTo(

        [formRef.current, labelRef.current],
        { opacity: 0 },
        {

            opacity: 1,
            duration: 0.8,
            scrollTrigger: {

                trigger: [formRef.current, labelRef.current],
                toggleActions: 'play none none none'

            }

        }

    )

}

export const animateCountry = ( countryRef ) => {

    gsap.fromTo(

        countryRef.current,
        { opacity : 0 },
        {

            opacity : 1,
            duration : 0.4

        }

    )

}