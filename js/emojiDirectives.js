'use strict';


emojiApp.directive('emojiForm', ['$timeout', '$http', '$interpolate','$compile', function($timeout, $http, $interpolate, $compile)
{
    return {
        scope:
        {
            emojiMessage: '='
        },
        link: link
    };

    function link($scope, element, attrs)
    {
        var messageField = $('textarea', element)[0],
            fileSelects = $('input', element),
            emojiButton = $('#emojibtn', element)[0],
            editorElement = messageField,
            emojiArea = $(messageField).emojiarea(
            {
                button: emojiButton,
                norealTime: true
            }),
            emojiMenu = $('.emoji-menu', element)[0],
            richTextarea = $(
                '.emoji-wysiwyg-editor', element)[0];

            var s = $compile($("#messageDiv"));
            $("#messageDiv").replaceWith(s($scope));


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
                .on('DOMNodeInserted', onPastedImageEvent)
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
                                    $scope.emojiMessage.messagetext = richTextarea.textContent;
                                });
                        }

                        $timeout.cancel(updatePromise);
                        updatePromise = $timeout(
                            updateValue, 1000);

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
                        $scope.emojiMessage.replyToUser();
                        // $(element).trigger('message_send');
                        resetTyping();
                        return cancelEvent(e);
                    }
                }

            });

        // $(submitBtn).on('mousedown touchstart', function(e)
        // {
        //     $timeout.cancel(updatePromise);
        //     updateValue();
        //     $scope.draftMessage.replyToUser();
        //     resetTyping();
        //     return cancelEvent(e);
        // });

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

        function onPastedImageEvent(e)
        {
            var element = (e.originalEvent || e).target,
                src = (element ||
                {}).src || '',
                remove = false;

            if (src.substr(0, 5) == 'data:')
            {
                remove = true;
                var blob = dataUrlToBlob(src);
                ErrorService.confirm(
                {
                    type: 'FILE_CLIPBOARD_PASTE'
                }).then(function()
                {
                    $scope.draftMessage.files = [blob];
                    $scope.draftMessage.isMedia = true;
                });
                setZeroTimeout(function()
                {
                    element.parentNode.removeChild(element);
                })
            }
            else if (src && !src.match(/img\/blank\.gif/))
            {
                var replacementNode = document.createTextNode(' ' + src + ' ');
                setTimeout(function()
                {
                    element.parentNode.replaceChild(replacementNode, element);
                }, 100);
            }
        };


        function onPasteEvent(e)
        {
            console.log("onPasteEvent");
            var cData = (e.originalEvent || e).clipboardData,
                items = cData && cData.items || [],
                files = [],
                file, i;

            for (i = 0; i < items.length; i++)
            {
                if (items[i].kind == 'file')
                {
                    file = items[i].getAsFile();
                    files.push(file);
                }
            }

            if (files.length > 0)
            {
                ErrorService.confirm(
                {
                    type: 'FILES_CLIPBOARD_PASTE',
                    files: files
                }).then(function()
                {
                    $scope.draftMessage.files = files;
                    $scope.draftMessage.isMedia = true;
                });
            }
        }

        function onKeyDown(e)
        {
            if (e.keyCode == 9 && !e.shiftKey && !e.ctrlKey && !e.metaKey && !$modalStack.getTop())
            { // TAB
                editorElement.focus();
                return cancelEvent(e);
            }
        }
        $(document).on('keydown', onKeyDown);
        $(document).on('paste', onPasteEvent);

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
