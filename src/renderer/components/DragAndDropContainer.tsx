import React, { useCallback, useEffect, useState } from 'react';
import Styled from 'styled-components';

const EntryUploaderWindowDiv = Styled.div<{ show: boolean }>`
    ${({ show }) => {
        if (show) {
            return `
                display: block;
                opacity: 1;
            `;
        } else {
            return `
                display: none;
                opacity: 0;
            `;
        }
    }}
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 86, 132, .9);
    z-index: 250000;
    text-align: center;
    -webkit-transition: opacity 250ms;
    transition: opacity 250ms;
`;

const EntryUploaderWindowContentDiv = Styled.div`
    height: unset !important;
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 1px dashed #fff;
`;

const UploaderWindowNotifyText = Styled.h1`
    margin: -.5em 0 0;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    font-size: 40px;
    color: #fff;
    padding: 0;
`;

interface IProps {
    text: string;
    onDropFile?: (filePath: string) => void;
}

const DragAndDropContainer: React.FC<IProps> = (props) => {
    const { text, onDropFile } = props;
    const [isShowContainer, toggleShowContainer] = useState(false);

    const handleDragEnter = useCallback((e: DragEvent) => {
        e.preventDefault();
        const dragFileType = e.dataTransfer?.types[0];
        if (dragFileType === 'Files') {
            toggleShowContainer(true);
        }
        return false;
    }, []);

    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        return false;
    }, []);

    const handleDragEnd = useCallback((e: DragEvent) => {
        e.preventDefault();
        if (!e.clientX && !e.clientY) {
            toggleShowContainer(false);
        }
        return false;
    }, []);

    const handleFileDrop = useCallback((e: DragEvent) => {
        if (onDropFile && e.dataTransfer?.files?.length) {
            toggleShowContainer(false);
            onDropFile(e.dataTransfer.files[0].path);
        }
    }, [onDropFile]);

    useEffect(() => {
        document.body.addEventListener('dragenter', handleDragEnter, false);
        document.body.addEventListener('dragleave', handleDragEnd, false);
        document.body.addEventListener('dragover', handleDragOver, false);
        document.body.addEventListener('dragend', handleDragEnd, false);
        document.body.addEventListener('drop', handleFileDrop);
        return () => {
            document.body.removeEventListener('dragenter', handleDragEnter);
            document.body.removeEventListener('dragleave', handleDragEnd);
            document.body.removeEventListener('dragover', handleDragOver);
            document.body.removeEventListener('dragend', handleDragEnd);
            document.body.removeEventListener('drop', handleFileDrop);
        };
    }, [handleDragEnd, handleDragEnter, handleDragOver, handleFileDrop]);

    return (
        <EntryUploaderWindowDiv show={isShowContainer}>
            <EntryUploaderWindowContentDiv>
                <UploaderWindowNotifyText>{text}</UploaderWindowNotifyText>
            </EntryUploaderWindowContentDiv>
        </EntryUploaderWindowDiv>
    );
};

export default DragAndDropContainer;
