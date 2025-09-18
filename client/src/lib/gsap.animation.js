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

export const animateProfile = ( profileRef ) => {

    gsap.fromTo(

        profileRef?.current,
        { opacity: 0 },
        {

            opacity: 1,
            duration: 0.8,
            scrollTrigger: {

                trigger: profileRef?.current,
                toggleActions: 'play none none none'

            }

        }

    )

}

export const animateCountry = (countryRef) => {

    // On initial this ref is not present on DOM
    // It is added only after an event
    if (countryRef.current) {

        gsap.fromTo(

            countryRef.current,
            { opacity: 0 },
            {

                opacity: 1,
                duration: 0.4

            }

        )

    }

}

export const animateMedicineData = ( medicineRef, isNull ) => {

    // This is used to animate medicine details
    // The opacity of ref during rendering animation is based on data present in the redux state
    // This is handled only during rendering animation and rest case is handled by CSS

    gsap.fromTo(

        medicineRef?.current,
        { opacity: 0 },
        {

            opacity: isNull ? 0.4 : 1,
            duration: 0.8,
            scrollTrigger: {

                trigger: medicineRef?.current,
                toggleActions: 'play none none none'

            }

        }

    )

}