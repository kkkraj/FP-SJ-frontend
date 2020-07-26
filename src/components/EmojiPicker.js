import React, {Component} from 'react';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

export default class EmojiPicker extends Component {
    handleAddEmoji = (emoji) => {
        console.log(emoji.title)
    }

    render () {
        return (
            <div>
                <Picker set="twitter" emoji="camping" onSelect={this.handleAddEmoji} title="" />
            </div>
        )
    }
}