'use strict';


emojiApp.directive('myForm', ['', function()
{
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
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
                dropbox = $('#dropbox', element)[0],
                emojiButton = $('#emojibtn', element)[0],
                editorElement = messageField, dragStarted, dragTimeout,

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
                                        $scope.messagetext = richTextarea.textContent;
                                    });
                            }

                            $timeout.cancel(updatePromise);
                            updatePromise = $timeout(
                                updateValue, 1000);
                        });
            }

            // Head is sometimes slower
            /*
             * $timeout(function () { fileSelects .on('change',
             * function () { var self = this; $scope.$apply(function () {
             * $scope.draftMessage.files =
             * Array.prototype.slice.call(self.files);
             * $scope.draftMessage.isMedia =
             * $(self).hasClass('im_media_attach_input') ||
             * Config.Mobile; setTimeout(function () { try {
             * self.value = ''; } catch (e) {}; }, 1000); }); }); },
             * 1000);
             */

            var sendOnEnter = true;
            /*
             * updateSendSettings = function () {
             * Storage.get('send_ctrlenter').then(function
             * (sendOnCtrl) { sendOnEnter = !sendOnCtrl; }); };
             */

            // $scope.$on('settings_changed', updateSendSettings);
            // updateSendSettings();
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

            /*
             * var lastTyping = 0, lastLength;
             * $(editorElement).on('keyup', function (e) { var now =
             * tsNow(), length = (editorElement[richTextarea ?
             * 'textContent' : 'value']).length;
             *
             *
             * if (now - lastTyping > 5000 && length != lastLength) {
             * lastTyping = now; lastLength = length;
             * $scope.$emit('ui_typing'); } });
             */

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

            $('body').on('dragenter dragleave dragover drop',
                onDragDropEvent);
            $(document).on('paste', onPasteEvent);

            /*
             * if (!Config.Navigator.touch) {
             * $scope.$on('ui_peer_change', focusField);
             * $scope.$on('ui_history_focus', focusField);
             * $scope.$on('ui_history_change', focusField); }
             *
             * $scope.$on('ui_peer_change', resetTyping);
             * $scope.$on('ui_peer_draft', updateRichTextarea);
             */

            var sendAwaiting = false;
            /*
             * $scope.$on('ui_message_before_send', function () {
             * sendAwaiting = true; $timeout.cancel(updatePromise);
             * updateValue(); }); $scope.$on('ui_message_send',
             * function () { sendAwaiting = false; focusField(); });
             */

            function focusField()
            {
                onContentLoaded(function()
                {
                    editorElement.focus();
                });
            }

            function onPastedImageEvent(e)
            {
                console.log("onPastedImageEvent");
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
                else if (src && !src.match(/\/blank\.gif/))
                {
                    var replacementNode = document
                        .createTextNode(' ' + src + ' ');
                    setTimeout(function()
                    {
                        element.parentNode.replaceChild(
                            replacementNode, element);
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

            function onDragDropEvent(e)
            {
                var dragStateChanged = false;
                if (!dragStarted || dragStarted == 1)
                {
                    dragStarted = checkDragEvent(e) ? 2 : 1;
                    dragStateChanged = true;
                }
                if (dragStarted == 2)
                {
                    if (dragTimeout)
                    {
                        setTimeout(function()
                        {
                            clearTimeout(dragTimeout);
                            dragTimeout = false;
                        }, 0);
                    }

                    if (e.type == 'dragenter' || e.type == 'dragover')
                    {
                        if (dragStateChanged)
                        {
                            /*
                             * $(dropbox).css( { height :
                             * $(editorElement) .height() + 12,
                             * width : $(editorElement) .width() +
                             * 12 }).show();
                             */
                        }
                    }
                    else
                    {
                        if (e.type == 'drop')
                        {
                            $scope
                                .$apply(function()
                                {
                                    $scope.draftMessage.files = Array.prototype.slice
                                        .call(e.originalEvent.dataTransfer.files);
                                    if ($scope.draftMessage.files.length == 1)
                                    {
                                        $scope.draftMessage
                                            .uploadSingleFile($scope.draftMessage.files[0]);
                                    }
                                    else if ($scope.draftMessage.files.length > 1)
                                    {
                                        alert('Uploading multiple files is not supported');
                                        return;
                                    }

                                });
                        }
                        dragTimeout = setTimeout(function()
                        {
                            // $(dropbox).hide();
                            dragStarted = false;
                            dragTimeout = false;
                        }, 300);
                    }
                }

                return cancelEvent(e);
            };

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

            /*
             * if (!Config.Navigator.touch) { focusField(); }
             */

        }
    }
]);
