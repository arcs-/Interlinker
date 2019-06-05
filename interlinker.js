/* Interlinker, (c) 2019 Patrick Stillhart (arcs-)
 * @license MIT */
(function (root, factory) {

    if (typeof define === 'function' && define.amd) define(factory)
    else if (typeof exports === 'object') module.exports = factory()
    else root.Interlinker = factory()

})(this, function () {

    var Interlinker = {}
    Interlinker.version = '1.0.0'
    Interlinker.audience = []

    /*******************************************
        public
    ********************************************/

    Interlinker.index = function () {

        Interlinker.clear()

        var allElements = document.getElementsByTagName("*")
        for (var i = 0, element; element = allElements[i++];) {

            var rawCondition = element.getAttribute("depends")
            if (!rawCondition) continue

            var node = new Node(element)
            node.refresh()
            Interlinker.audience.push(node)

        }

    }

    Interlinker.clear = function () {

        for (var node of Interlinker.audience) node.destroy()
        Interlinker.audience = []

    }

    /*******************************************
        private
    ********************************************/

    function Node(element) {
        this.element = element
        this.checks = []

        var rawCondition = element.getAttribute("depends")
        if (rawCondition[0] == '[' && rawCondition[rawCondition.length - 1] == ']') this.conditions = rawCondition.slice(1, -1).split(',')
        else this.conditions = [rawCondition]

        for (var i = 0, condition; condition = this.conditions[i++];) {

            condition = condition.trim()
            var reverse = condition[0] == '!'
            var query = reverse ? condition.trim().substring(1) : condition

            var conditionElement = document.getElementById(query)
            if (!conditionElement || conditionElement.tagName != 'INPUT') {
                console.error('invalied dependency <', condition, '>')
                continue
            }

            if (!conditionElement.type) var eventListenerType = 'input'
            else if (conditionElement.type == 'checkbox') var eventListenerType = 'click'
            else var eventListenerType = 'input'

            var functionReference = this.refresh.bind(this)
            conditionElement.addEventListener(eventListenerType, functionReference)
            this.checks.push({ conditionElement, reverse, eventListenerType, functionReference })

        }

    }

    Node.prototype = {

        destroy: function () {
            for (var i = 0, check; check = this.checks[i++];) {
                this.conditionElement.removeEventListener(check.eventListenerType, check.functionReference);
            }
        },

        refresh: function () {

            for (var i = 0, check; check = this.checks[i++];) {
                // text
                if (!check.conditionElement.type) {
                    if (check.reverse == check.conditionElement.validity.valid) return this.disable(true)

                // chechboxes
                } else if (check.conditionElement.type == 'checkbox') {
                    if (check.reverse == check.conditionElement.checked) return this.disable(true)

                // text again
                } else if (check.reverse == check.conditionElement.validity.valid) return this.disable(true)

            }

            return this.disable(false)
        },

        disable: function (disable) {
            if (this.element.tagName == 'INPUT') this.element.disabled = disable
            else disable ? this.element.classList.add('disabled') : this.element.classList.remove('disabled')

            return disable
        }

    }


    /*******************************************
        done
    ********************************************/

    return Interlinker

})