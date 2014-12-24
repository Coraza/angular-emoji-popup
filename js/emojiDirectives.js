'use strict';


emojiApp.directive('myForm', ['$http', '$interpolate', function($http, $interpolate)
{
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        scope:
        {}, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
        // template: '',
        // templateUrl: '',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: link
    };

    function link($scope, element, attrs)
    {
        var messageField = $('textarea', element)[0],
            fileSelects = $('input', element),
            emojiButton = $('#emojibtn', element)[0],
            editorElement = messageField,
            dragStarted, dragTimeout,

            emojiArea = $(messageField).emojiarea(
            {
                button: emojiButton,
                norealTime: true
            }),
            emojiMenu = $('.emoji-menu', element)[0],
            submitBtn = $(
                '.im_submit', element)[0],
            richTextarea = $(
                '.emoji-wysiwyg-editor', element)[0];

        if (richTextarea)
        {
            editorElement = richTextarea;
            $(richTextarea).addClass('form-control');
            $(richTextarea)
                .attr(
                    'placeholder',
                    $interpolate(
                        $(messageField).attr(
                            'placeholder'))(
                        $scope));

            var updatePromise;
            $(richTextarea)
                .on(
                    'keyup',
                    function(e)
                    {
                        updateHeight();

                        if (!sendAwaiting)
                        {
                            $scope
                                .$apply(function()
                                {
                                    $scope.messagetext = richTextarea.textContent;
                                });
                        }

                    });
        }

        var sendOnEnter = true;

        $(editorElement).on(
            'keydown',
            function(e)
            {
                if (richTextarea)
                {
                    updateHeight();
                }

                if (e.keyCode == 13)
                {
                    var submit = false;
                    if (sendOnEnter && !e.shiftKey)
                    {
                        submit = true;
                    }
                    else if (!sendOnEnter && (e.ctrlKey || e.metaKey))
                    {
                        submit = true;
                    }

                    if (submit)
                    {
                        $timeout.cancel(updatePromise);
                        updateValue();
                        $scope.draftMessage.replyToUser();
                        // $(element).trigger('message_send');
                        resetTyping();
                        return cancelEvent(e);
                    }
                }

            });

        $(submitBtn).on('mousedown touchstart', function(e)
        {
            $timeout.cancel(updatePromise);
            updateValue();
            $scope.draftMessage.replyToUser();
            // $(element).trigger('message_send');
            resetTyping();
            return cancelEvent(e);
        });

        function resetTyping()
        {
            // lastTyping = 0;
            // lastLength = 0;
        };

        function updateRichTextarea()
        {
            console.log("updateRichTextarea");
            if (richTextarea)
            {
                $timeout.cancel(updatePromise);
                var html = $('<div>').text(
                    $scope.draftMessage.text || '').html();
                html = html.replace(/\n/g, '<br/>');
                $(richTextarea).html(html);
                lastLength = html.length;
                updateHeight();
            }
        }

        function updateValue()
        {
            if (richTextarea)
            {
                $(richTextarea).trigger('change');
                updateHeight();
            }
        }

        var height = richTextarea.offsetHeight;

        function updateHeight()
        {
            var newHeight = richTextarea.offsetHeight;
            if (height != newHeight)
            {
                height = newHeight;
                $scope.$emit('ui_editor_resize');
            }
        };

        function onKeyDown(e)
        {
            if (e.keyCode == 9 && !e.shiftKey && !e.ctrlKey && !e.metaKey && !$modalStack.getTop())
            { // TAB
                editorElement.focus();
                return cancelEvent(e);
            }
        }
        $(document).on('keydown', onKeyDown);

        var sendAwaiting = false;
        function focusField()
        {
            onContentLoaded(function()
            {
                editorElement.focus();
            });
        }

        $scope.$on('$destroy', function cleanup()
        {

            $('body').off('dragenter dragleave dragover drop',
                onDragDropEvent);
            $(document).off('paste', onPasteEvent);
            $(document).off('keydown', onKeyDown);
            $(submitBtn).off('mousedown')
            fileSelects.off('change');
            if (richTextarea)
            {
                $(richTextarea).off('DOMNodeInserted keyup',
                    onPastedImageEvent);
            }
            $(editorElement).off('keydown');
        });
    }
}]);
