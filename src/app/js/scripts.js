/*
Image gallery upload without ajax - Code by Zsolt Király
v1.0.0 - 2018-10-24
*/

var eventGallery = function() {

    'use strict';

    function signatura() {
        if (window['console']) {
            const text = {
                black: '%c     ',
                blue: '%c   ',
                author: '%c  Zsolt Király  ',
                github: '%c  https://zsoltkiraly.com/'
            }

            const style = {
                black: 'background: #282c34',
                blue: 'background: #61dafb',
                author: 'background: black; color: white',
                github: ''
            }

            console.log(text.black + text.blue + text.author + text.github, style.black, style.blue, style.author, style.github);
        }
    }

    signatura();

    if (!Element.prototype.matches)
        Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                    Element.prototype.webkitMatchesSelector;
                                    
    if (!Element.prototype.closest) {
        Element.prototype.closest = function(s) {
            var el = this;
            if (!document.documentElement.contains(el)) return null;
            do {
                if (el.matches(s)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1); 
            return null;
        };
    }

    errorDOM();

    var fileInput = document.getElementById('file-input'),
        dragAndDropUpload = document.getElementById('drag-and-drop-upload'),
        dragContainer = dragAndDropUpload.querySelector('.drag-container'),
        galleryUploadButton = document.getElementById('gallery-upload-button'),
        amountContainer = document.getElementById('amount-container'),
        error = document.getElementById('error-upload'),
        errorUploadContainer = error.querySelector('.error-upload-container section.error-container .error-content'),
        dragAndDropStart = document.getElementById('drag-and-drop-start'),
        uploadAmount = document.querySelectorAll('section.image-gallery-upload .upload-amount');

    function fileDragHover(e) {
        e.stopPropagation();
        e.preventDefault();

        if(e.type == 'dragover') {
            dragAndDropStart.classList.add('hover');
        } else {
            dragAndDropStart.classList.remove('hover');
        }
    }

    function mobileView(dADU, b) {
        if (window.matchMedia('(max-width: 768px)').matches) {
            if(b) {
                dADU.classList.add('upload-mobile');
            } else {
                dADU.classList.remove('upload-mobile');
            }
        }
    }

    function fileInputReset() {
        fileInput.value = '';
    }

    function galleryIndex() {
        var allFileInput = dragAndDropUpload.querySelectorAll('.image-container input[type="file"]');

        allFileInput.forEach(function(item, index) {
            item.setAttribute('name', 'eventGalleryImage_' + (index + 1));
        });
    }

    function closeError() {
        var closeIcon = error.querySelector('.header i.upload-error-close');

        if(closeIcon) { 
            closeIcon.addEventListener('click', function() {
                error.className = 'hide';
            }, false);
        }
    }

    function errorDOM() {
        var errorDOM = document.createElement('SECTION');
        errorDOM.setAttribute('id', 'error-upload');
        errorDOM.setAttribute('class', 'hide');

        errorDOM.innerHTML = 
        '<div class="error-upload-container">' +
            '<div class="header">' +
            '<span><i class="camera">&#128247</i>Bad picture size</span>' +
            '<i class="upload-error-close"></i>' +
            '</div>' +
            '<section class="error-container">' +
                '<p>The following images do not match the size of the image. Images should have a minimum of 300×300 pixels, maximum 1920×1920 pixels!</p>' +
                '<div class="error-content"></div>'
            '</section>'
        '</div>'

        document.body.insertBefore(errorDOM, document.body.firstChild);
    }

    function counter() {
        var maxNumber = dragAndDropUpload.querySelectorAll('.image-container input[type="file"]').length,
            number = amountContainer.querySelector('span');

        if(number) {
            number.innerHTML = 14 - maxNumber;
        }

        if(maxNumber >= 14) {
            fileInput.disabled = true;
            amountContainer.innerHTML = 'Can not upload more images!';
            galleryUploadButton.classList.add('disabled');

        } else {
            fileInput.disabled = false;
            galleryUploadButton.classList.remove('disabled');
            amountContainer.innerHTML = 'Upload <span>' + (14 - maxNumber) +'</span> more pictures.';
        }
    }

    function removeImage(hMOE) {

        var allFileInput = dragAndDropUpload.querySelectorAll('.image-container:nth-child(1n+' + (hMOE + 1) + ') i.image-remove');

        allFileInput.forEach(function(item, index) {

            item.addEventListener('click', function() {
                var obj = this;

                var closetImageContainer = obj.closest('.image-container');
                if(closetImageContainer) {
                    dragContainer.removeChild(closetImageContainer);

                    var newImgContainer = document.createElement('DIV');
                    newImgContainer.setAttribute('class', 'image-container');

                    dragContainer.insertBefore(newImgContainer, dragContainer.lastChild);

                    galleryIndex();
                    counter();

                    if(dragAndDropUpload.querySelectorAll('.image-container i.image-remove').length == 0) {
                        uploadAmount.forEach(function(item, index) {
                            item.classList.add('in-active');
                        });

                        dragAndDropStart.classList.add('active');
                        
                        setTimeout(function() {
                            dragAndDropStart.classList.add('opacity-show');
                        }, 50);

                        mobileView(dragAndDropUpload, false);

                        window.addEventListener('resize', function() {
                            mobileView(dragAndDropUpload, false);
                        }, false);
                    }
                }
            }, false);
        });
    }

    function parseFilePromise(f) {

        return new Promise(function(resolve, reject) {

            if (f.type.indexOf('image') == 0) {

                var reader = new FileReader();

                reader.addEventListener('load', function (e) {

                    var img = new Image();

                    img.src = e.target.result;

                    img.addEventListener('load', function() {
                        var width = img.naturalWidth,
                            height = img.naturalHeight;

                        if(width <= 1920 && width >= 300 && height <= 1920 && height >= 300) {
                            resolve({
                                success: true,
                                name: f.name
                            });
                        } else {
                            resolve({
                                success: false,
                                name: f.name
                            });
                        }
                    }, false);

                }, false);

                reader.readAsDataURL(f);
            }
        });
    }

    function parseFile(f, hMOE) {
        
        if (f.type.indexOf('image') == 0) {

            //base64
            var reader = new FileReader();

            reader.addEventListener('load', function (e) {

                var img = new Image();

                img.src = e.target.result;

                img.addEventListener('load', function() {
                    var width = img.naturalWidth,
                        height = img.naturalHeight;

                    if(hMOE < 14) {
                        if(width <= 1920 && width >= 300 && height <= 1920 && height >= 300) {

                            var imgContainer = document.createElement('DIV');
                            imgContainer.setAttribute('class', 'image-container loading');
                            imgContainer.innerHTML = 
                            '<i class="image-remove"></i>' + 
                            '<img src="' + e.target.result + '" alt="" />';

                            var howManyElement = dragContainer.querySelectorAll('.image-container img').length;

                            dragContainer.insertBefore(imgContainer, dragContainer.children[howManyElement]);

                            var input = document.createElement('INPUT');
                            input.type = 'file';
                            input.files = new FileList(f);

                            imgContainer.insertBefore(input, imgContainer.firstChild);

                            dragContainer.removeChild(dragContainer.lastElementChild); 
                            
                            counter();

                            uploadAmount.forEach(function(item, index) {
                                item.classList.remove('in-active');
                            });

                            dragAndDropStart.classList.remove('opacity-show');

                            setTimeout(function() {
                                dragAndDropStart.classList.remove('active');
                            }, 350);

                            mobileView(dragAndDropUpload, true);

                            window.addEventListener('resize', function() {
                                mobileView(dragAndDropUpload, true);
                            }, false);

                        } else {
                            var span = document.createElement('SPAN');
                            span.setAttribute('class', 'error-img');
                            span.innerHTML = f.name + ' (' + width + '×' + height + ')' + '<span class="comma">,</span>';

                            if(errorUploadContainer) {
                                errorUploadContainer.insertBefore(span, errorUploadContainer.firstChild);
                            }
                        }
                    }
                });

            }, false);

            reader.readAsDataURL(f);
        }
    }

    function fileSelectHandler(e) {
        var errorDimension = false;
        var howManyOldElement = dragContainer.querySelectorAll('.image-container img').length;

        if(errorUploadContainer) {
            errorUploadContainer.innerHTML = '';
        }

        error.className = 'hide';

        fileDragHover(e);

        var promises = [];

        var fileList = e.target.files || e.dataTransfer.files,
            len = fileList.length;

        for(var i = 0; i < fileList.length; i++) {
            parseFile(fileList[i], howManyOldElement);
            promises.push(parseFilePromise(fileList[i]));
        }

        fileInputReset();

        if(howManyOldElement < 14) {
            Promise.all(promises).then(function(results){
                for(var i = 0; i < results.length; i++) {

                    if(!results[i].success) {
                        errorDimension = true;
                    }

                    if(i == (results.length - 1)) {
                        setTimeout(function() {
                            removeImage(howManyOldElement);
                            galleryIndex();
                        }, 100);

                        if(errorDimension) {
                            setTimeout(function() {
                                error.className = 'show';
                            }, 100);
                        }
                    }
                }
            });
        }
    }

    function app() {
        if (window.File && window.FileList && window.FileReader) {

            fileInput.addEventListener('change', fileSelectHandler, false);
            dragAndDropUpload.addEventListener('dragover', fileDragHover, false);
            dragAndDropUpload.addEventListener('dragleave', fileDragHover, false);
            dragAndDropUpload.addEventListener('drop', fileSelectHandler, false);
        }

        closeError();
    }

    return {
        app: app
    }
}();

eventGallery.app();