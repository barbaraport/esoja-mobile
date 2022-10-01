import React from 'react';
import { View, Text, Image, ImageProps, ImageSourcePropType, TouchableOpacity } from 'react-native';

type ImageDisplayerProps = {
    title: string
    image: ImageSourcePropType
    closeFunction(): void
};

export const ImageDisplayer: React.FC<ImageDisplayerProps> = ({image, title, closeFunction}) => {
    return (
        <View style={{position: 'absolute', top: 0, left: 0, backgroundColor: '#FFFFFF',
         width: '100%', height: '100%', zIndex: 10}}>
            <View style={{width: '100%', backgroundColor: '#EEEEEE', height: 100,
                alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 30, fontWeight: 'bold'}}>{title}</Text>
                <TouchableOpacity style={{position:'absolute', right: 20, top: 20}} onPress={closeFunction}
                    activeOpacity={0.5}>
                    <Text style={{fontSize: 20}}>X</Text>
                </TouchableOpacity>
            </View>
            <View style={{backgroundColor: '#DDDDDD', width: '100%', height: '100%'}}>
                <Image source={image}/>
            </View>
        </View>
    );
}
