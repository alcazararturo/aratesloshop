import React, { PropsWithChildren } from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import styles from './ProductSlideshow.module.css';

interface Props {
    images: string[];
}

export const ProductSlideshow: React.FC<PropsWithChildren<Props>> = ({ images }) => {

  return (
    <Slide
        easing='ease'
        duration={3000}
        indicators
    >
        {
            images.map( image => {
                return (
                    <div className={ styles['each-slide'] } key={ image }>
                        <div style={{
                            backgroundImage: `url( ${image} )`,
                            backgroundSize: 'cover'
                        }}>

                        </div>
                    </div>
                )
            })
        }
    </Slide>
  )
}
