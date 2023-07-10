import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Animated,
    TouchableHighlight,
    Image,
    ImageBackground,
} from 'react-native';
import * as d3Shape from 'd3-shape';

import Svg, { G, Text, TSpan, Path, Pattern } from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const { width, height } = Dimensions.get('screen');

class WheelOfFortune extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enabled: false,
            started: false,
            finished: false,
            winner: null,
            gameScreen: new Animated.Value(width - 40),
            wheelOpacity: new Animated.Value(1),
            imageLeft: new Animated.Value(width / 2 - 30),
            imageTop: new Animated.Value(height / 2 - 70),
        };
        this.angle = 0;

        this.prepareWheel();
    }

    prepareWheel = () => {
        this.Rewards = this.props.options.rewards;
        this.RewardCount = this.Rewards.length;

        this.numberOfSegments = this.RewardCount;
        this.fontSize = 20;
        this.oneTurn = 360;
        this.angleBySegment = this.oneTurn / this.numberOfSegments;
        this.angleOffset = this.angleBySegment / 2;
        this.winner = this.props.options.winner ?? Math.floor(Math.random() * this.numberOfSegments);

        this._wheelPaths = this.makeWheel();
        this._angle = new Animated.Value(0);

        this.props.options.onRef(this);
    };
    componentWillUnmount() {
        this.props.options.onRef(undefined);
    }
    makeWheel = () => {
        const data = Array.from({ length: this.numberOfSegments }).fill(1);
        const arcs = d3Shape.pie()(data);
        var colors = this.props.options.colors
            ? this.props.options.colors
            : [
                'rgba(0,0,0,0.1)',
                'rgba(0,0,0,0.1)',
                'rgba(0,0,0,0.1)',
                'rgba(0,0,0,0.1)',
                'rgba(0,0,0,0.1)',
            ];
        return arcs.map((arc, index) => {
            const instance = d3Shape
                .arc()
                .padAngle(0.02)
                .outerRadius(width / 2)
                .innerRadius(90);
            return {
                path: instance(arc),
                // color: 'rgba(255,255,255,0.3)',
                color: 'transparent',
                value: this.Rewards[index],
                centroid: instance.centroid(arc),
            };
        });
    };

    _textRender = (x, y, number, i) => (
        <Text
            x={x - number.length * 5}
            y={y - 80}
            fill={
                this.props.options.textColor ? this.props.options.textColor : '#fff'
            }
            textAnchor="middle"
            fontSize={this.fontSize}>
            {Array.from({ length: number.length }).map((_, j) => {
                // Render reward text vertically
                if (this.props.options.textAngle === 'vertical') {
                    return (
                        <TSpan x={x} dy={20} key={`arc-${i}-slice-${j}`}>
                            {number.charAt(j)}
                        </TSpan>
                    );
                }
                // Render reward text horizontally
                else {
                    return (
                        <TSpan
                            y={y - 40}
                            dx={this.fontSize * 0.07}
                            key={`arc-${i}-slice-${j}`}>
                            {number.charAt(j)}
                        </TSpan>
                    );
                }
            })}

        </Text>
    );

    _renderSvgWheel = () => {
        return (
            <View style={styles.container}>

                <Animated.View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0d5941',
                        width: width - 60,
                        height: width - 60,
                        borderRadius: (width - 20) / 2,
                        borderWidth: this.props.options.borderWidth
                            ? this.props.options.borderWidth
                            : 2,
                        borderColor: this.props.options.borderColor
                            ? this.props.options.borderColor
                            : '#fff',
                        opacity: 1,
                    }}>
                    <ImageBackground source={require('./../../assets/images/wheel.png')}  resizeMode="center">
                        <AnimatedSvg
                            width={this.state.gameScreen}
                            height={this.state.gameScreen}
                            viewBox={`0 0 ${width} ${width}`}
                            style={{
                                transform: [{ rotate: `-60deg` }],
                                margin: 20,
                            }}>
                            <G y={width / 2} x={width / 2}>
                                {this._wheelPaths.map((arc, i) => {
                                    const [x, y] = arc.centroid;
                                    const number = arc.value.toString();
                                    return (
                                        <G key={`arc-${i}`} onPress={() => this.props.navigate(number)}>
                                            <Path d={arc.path} fill={arc.color} />
                                        </G>
                                    );
                                })}
                            </G>
                        </AnimatedSvg>
                    </ImageBackground>
                </Animated.View>

            </View>
        );
    };
    render() {
        return (
            <View style={styles.container}>
                <View
                    style={{
                        position: 'absolute',
                        width: width,
                        height: height / 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Animated.View style={{ padding: 10 }}>
                        {this._renderSvgWheel()}
                    </Animated.View>
                </View>
            </View>
        );
    }
}

export default WheelOfFortune;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});