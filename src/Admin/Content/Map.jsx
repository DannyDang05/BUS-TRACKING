import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';
import { useOutletContext } from 'react-router-dom';



const Map=(props)=>{
    const {collapsed} = useOutletContext();
    const mapRef = useRef()
    const mapContainerRef = useRef()

   useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoibGlraWpvb25nMSIsImEiOiJjbWg5eXlyN24wMDFlMnJuNmIxY2kxOTc2In0.KDmPuA2vvdV6G28mpeK4KA'
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11', 
            center: [106.660172, 10.762622], 
                zoom: 12                            
        });

        return () => {
            mapRef.current.remove()
        }
    }, [])

    useEffect(()=>{
            
                if(mapRef.current){
                mapRef.current.resize()
            }
 
    },[collapsed])

    return (
        <>
            <div className='map-container' ref={mapContainerRef} />
        </>
    )
}

export default Map