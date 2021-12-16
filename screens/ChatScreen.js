import React from 'react'
import { SafeAreaView } from 'react-native'
import ChartList from '../components/ChartList'
import Header from '../components/Header'

const ChatScreen = () => {
    return (
        <SafeAreaView>
            <Header title="Chat" />
            <ChartList/>
        </SafeAreaView>

    )
}

export default ChatScreen
