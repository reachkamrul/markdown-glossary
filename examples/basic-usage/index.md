# VitePress Glossary Plugin Example

Welcome to this example of the VitePress Glossary Plugin! This page demonstrates how the plugin automatically detects and links terms from your glossary.

## Basic Usage

VitePress is a modern Static Site generator. It uses Vue components to create interactive documentation.

## Preventing Term Linking

Sometimes you might want to prevent a term from being linked. For example: //VitePress// won't be linked here.

## Multiple Terms

The Plugin enhances your Markdown documentation by automatically linking terms. Each Component in Vue helps create a modular application.

## First Occurrence Only

Notice that in this example, we've set `firstOccurrenceOnly: true` in the configuration. This means that VitePress will only be linked the first time it appears on the page, not here.

## Technical Details

The Glossary plugin works by scanning your content for defined terms and wrapping them in a custom Vue Component that provides the tooltip functionality. 