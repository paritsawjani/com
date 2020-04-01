<?php
/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */


return [
    'router' => [
        'routes' => [
            'literal' => [
                'type'    => 'Literal',
                'options' => [
                    'route'    => '/',
                    'defaults' => [
                        'controller' => 'Magento\Setup\Controller\Index',
                        'action'     => 'index',
                    ],
                ],
            ],
            'setup' => [
                'type'    => 'Segment',
                'options' => [
                    'route'    => '[/:controller[/:action]]',
                    'defaults' => [
                        '__NAMESPACE__' => 'Magento\Setup\Controller',
                        'controller'    => 'Index',
                        'action'        => 'index',
                    ],
                    'constraints' => [
                        'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ],
                ],
            ],
            'navigation' => [
                'type'    => 'Segment',
                'options' => [
                    'route'    => '[/navigation[/:action]]',
                    'defaults' => [
                        '__NAMESPACE__' => 'Codazon\Setup\Controller',
                        'controller'    => 'Navigation',
                        'action'        => 'index',
                    ],
                    'constraints' => [
                        'controller' => 'Navigation',
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ],
                ],
            ],
            'install' => [
                'type'    => 'Segment',
                'options' => [
                    'route'    => '[/install[/:action]]',
                    'defaults' => [
                        '__NAMESPACE__' => 'Codazon\Setup\Controller',
                        'controller'    => 'Install',
                        'action'        => 'index',
                    ],
                    'constraints' => [
                        'controller' => 'Install',
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ],
                ],
            ],
        ],
    ],
];
